import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminApp from "./admin/AdminApp";
import "./App.css";

// ✅ Separate component for your portfolio page
// const Portfolio = ({ darkMode, setDarkMode }) => (
//   <div className="app">
//     <Header darkMode={darkMode} setDarkMode={setDarkMode} />
//     <Hero />
//     <About />
//     <Skills />
//     <Projects />
//     <Contact />
//     <Footer />
//   </div>
// );
const Portfolio = () => (
  <div className="app">
    <Projects />
  </div>
);

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    // ✅ BrowserRouter wraps everything
    <BrowserRouter>
      <Routes>
        {/* ✅ Portfolio on root path */}
        <Route
          path="/"
          element={<Portfolio darkMode={darkMode} setDarkMode={setDarkMode} />}
        />

        {/* ✅ Admin on /admin/* */}
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
