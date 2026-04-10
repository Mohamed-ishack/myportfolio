import React from 'react';
import { 
  FaReact, FaNodeJs, FaPython, FaJava, 
  FaHtml5, FaJs, FaDatabase, FaCode 
} from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiExpress } from 'react-icons/si';
import './Skills.css';

const iconMap = {
  React: FaReact,
  'Node.js': FaNodeJs,
  Python: FaPython,
  Java: FaJava,
  'HTML/CSS': FaHtml5,
  JavaScript: FaJs,
  TypeScript: SiTypescript,
  Express: SiExpress,
  MongoDB: SiMongodb,
  PostgreSQL: FaDatabase,
  MySQL: FaDatabase
};

const getIcon = (iconKey) => {
  const Icon = iconMap[iconKey] || FaCode;
  return <Icon />;
};

const Skills = ({ skills }) => {
  const skillCategories = skills?.length ? skills : [
    {
      title: "Frontend",
      skills: [
        { name: "React", icon: <FaReact />, level: 90 },
        { name: "JavaScript", icon: <FaJs />, level: 85 },
        { name: "TypeScript", icon: <SiTypescript />, level: 80 },
        { name: "HTML/CSS", icon: <FaHtml5 />, level: 90 }
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "Node.js", icon: <FaNodeJs />, level: 85 },
        { name: "Python", icon: <FaPython />, level: 80 },
        { name: "Java", icon: <FaJava />, level: 75 },
        { name: "Express", icon: <SiExpress />, level: 85 }
      ]
    },
    {
      title: "Database",
      skills: [
        { name: "MongoDB", icon: <SiMongodb />, level: 80 },
        { name: "PostgreSQL", icon: <FaDatabase />, level: 75 },
        { name: "MySQL", icon: <FaDatabase />, level: 85 }
      ]
    }
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">My Skills</h2>
        <div className="skills-container">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="skill-category">
              <h3>{category.title}</h3>
              <div className="skills-grid">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skillIdx} className="skill-item">
                    <div className="skill-icon">
                      {typeof skill.icon === 'string' ? getIcon(skill.icon) : skill.icon}
                    </div>
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <div className="skill-bar">
                        <div 
                          className="skill-progress" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;