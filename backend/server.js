import express from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, 'data.json');
const UPLOADS_PATH = path.join(__dirname, 'uploads');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'ishackdq';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('ishack12345@#', 10);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'portfolio-admin-token';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_PATH);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_PATH));

async function loadData() {
  try {
    const content = await readFile(DATA_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read data file:', error);
    throw new Error('Unable to load portfolio data');
  }
}

async function saveData(data) {
  try {
    await writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return data;
  } catch (error) {
    console.error('Failed to save data file:', error);
    throw new Error('Unable to save portfolio data');
  }
}

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token === ADMIN_TOKEN) {
    return next();
  }

  res.status(401).json({ error: 'Unauthorized' });
}

app.get('/api/portfolio', async (req, res) => {
  try {
    const data = await loadData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME) {
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (isValidPassword) {
      return res.json({ token: ADMIN_TOKEN });
    }
  }

  res.status(401).json({ error: 'Invalid username or password' });
});

// Image upload endpoint
app.post('/api/upload', authenticateAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', authenticateAdmin, async (req, res) => {
  try {
    const data = await loadData();
    const project = req.body;
    if (!project.title || !project.description) {
      return res.status(400).json({ error: 'Project title and description are required.' });
    }
    const nextId = data.projects.length > 0 ? Math.max(...data.projects.map((p) => p.id)) + 1 : 1;
    const newProject = {
      id: nextId,
      title: project.title,
      category: project.category || 'frontend',
      description: project.description,
      tech: project.tech || [],
      image: project.image || 'https://via.placeholder.com/400x300',
      github: project.github || '#',
      demo: project.demo || '#'
    };
    data.projects.push(newProject);
    await saveData(data);

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    const data = await loadData();
    const projectId = Number(req.params.id);
    const projectIndex = data.projects.findIndex((project) => project.id === projectId);

    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    data.projects.splice(projectIndex, 1);
    await saveData(data);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profile', authenticateAdmin, async (req, res) => {
  try {
    const data = await loadData();
    const { hero, about } = req.body;

    if (hero) {
      data.hero = {
        ...data.hero,
        ...hero
      };
    }

    if (about) {
      data.about = {
        ...data.about,
        ...about
      };
    }

    await saveData(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/skills', authenticateAdmin, async (req, res) => {
  try {
    const data = await loadData();
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array.' });
    }

    data.skills = skills;
    await saveData(data);
    res.json(data.skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Portfolio backend running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the process using it or set PORT to a different port.`);
  } else {
    console.error('Backend server error:', error);
  }
  process.exit(1);
});
