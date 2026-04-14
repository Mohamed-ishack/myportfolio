import { getStore } from '@netlify/blobs'
import bcrypt from 'bcryptjs'

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ success: false, error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return Response.json({ success: false, error: 'Username and password are required' }, { status: 400 })
    }

    const store = getStore({ name: 'admin-auth', consistency: 'strong' })

    // Check if admin credentials exist, if not seed them
    let admin = await store.get('admin', { type: 'json' })

    if (!admin) {
      // Seed default admin credentials on first use
      const hashedPassword = await bcrypt.hash('admin123', 10)
      admin = { username: 'admin', password: hashedPassword }
      await store.setJSON('admin', admin)
    }

    // Validate credentials
    if (username !== admin.username) {
      return Response.json({ success: false, error: 'Invalid username or password' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, admin.password)

    if (!passwordMatch) {
      return Response.json({ success: false, error: 'Invalid username or password' }, { status: 401 })
    }

    return Response.json({ success: true, message: 'Login successful' })
  } catch (err) {
    console.error('Login error:', err)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export const config = {
  path: '/api/admin/login',
  method: 'POST',
}
