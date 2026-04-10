import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Admin from './components/Admin';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { getPortfolio } from './api';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [portfolio, setPortfolio] = useState(null);
  const [route, setRoute] = useState(window.location.pathname === '/admin' ? '/admin' : '/');
  const [adminKey, setAdminKey] = useState(0);

  const refreshPortfolio = async () => {
    try {
      const data = await getPortfolio();
      setPortfolio(data);
    } catch (error) {
      console.error('Unable to load portfolio data:', error);
    }
  };

  useEffect(() => {
    refreshPortfolio();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    const handlePopState = () => {
      const newRoute = window.location.pathname === '/admin' ? '/admin' : '/';
      setRoute(newRoute);
      if (newRoute === '/admin') {
        setAdminKey(prev => prev + 1);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path) => {
    window.history.pushState({}, '', path);
    setRoute(path === '/admin' ? '/admin' : '/');
    if (path === '/admin') {
      setAdminKey(prev => prev + 1);
    }
  };

  return (
    <div className="app">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isAdminPage={route === '/admin'}
        onNavigate={handleNavigate}
      />
      {route === '/admin' ? (
        <Admin key={adminKey} portfolio={portfolio} onRefresh={refreshPortfolio} onNavigate={handleNavigate} />
      ) : (
        <>
          <Hero hero={portfolio?.hero} />
          <About about={portfolio?.about} />
          <Skills skills={portfolio?.skills} />
          <Projects projects={portfolio?.projects} />
          <Contact />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;