import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaHtml5,
  FaJs,
  FaDatabase,
  FaCode,
} from "react-icons/fa";
import { SiTypescript, SiMongodb, SiExpress } from "react-icons/si";
import { Atom } from 'react-loading-indicators';
import "./Skills.css";

const iconMap = {
  React: FaReact,
  "Node.js": FaNodeJs,
  Python: FaPython,
  Java: FaJava,
  "HTML/CSS": FaHtml5,
  JavaScript: FaJs,
  TypeScript: SiTypescript,
  Express: SiExpress,
  MongoDB: SiMongodb,
  PostgreSQL: FaDatabase,
  MySQL: FaDatabase,
};

const getIcon = (iconKey) => {
  const Icon = iconMap[iconKey] || FaCode;
  return <Icon />;
};

const Skills = () => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/skills`)
      .then((response) => {
        setSkillCategories(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching skills:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">My Skills</h2>
        <div className="loading" style={{ minHeight: '250px' }}>
          <Atom color="#32cd32" size="medium" text="Loading Skills..." textColor="" />
        </div>
      </div>
    </section>
  );

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
                      <div className="skill-icon">{getIcon(skill.icon)}</div>
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <div className="skill-bar">
                          <div
                            className="skill-progress"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
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
