import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { ThemeProvider, useTheme } from "./ThemeContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BlogSection from "./components/BlogSection";
import PapershelfSection from "./components/PapershelfSection";
import TopicsSection from "./components/TopicsSection";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Journey from "./components/Journey";
import Projects from "./components/Projects";

// Component to handle hash scrolling after navigation
function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);

  return null;
}

function Home() {
  return (
    <>
      <Hero />
      <BlogSection />
      <TopicsSection />
      <PapershelfSection />
      <Newsletter />
    </>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  return (
    <Router>
      <div className={`App min-h-screen transition-colors duration-0 ${isDark ? 'dark bg-[#0f0f14]' : 'bg-[#F5F1E8]'}`}>
        <ScrollToHash />
        <div className="grain-overlay" />
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </main>
        <Footer />
        <CustomCursor />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
