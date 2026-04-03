import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { SiteContentProvider } from "./SiteContentContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BlogSection from "./components/BlogSection";
import PapershelfSection from "./components/PapershelfSection";
import TopicsSection from "./components/TopicsSection";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Journey from "./components/Journey";
import ProjectsSection from "./components/projects-section";
import AdminDashboard from "./components/AdminDashboard";
import AdminImageGate from "./components/AdminImageGate";
import DevHud from "./components/DevHud";
import DevCommandPalette from "./components/DevCommandPalette";
import DevMatrixRain from "./components/DevMatrixRain";
import DevBootSequence from "./components/DevBootSequence";
import DevRouteBadges from "./components/DevRouteBadges";

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
      <ProjectsSection />
      <TopicsSection />
      <PapershelfSection />
      <Newsletter />
    </>
  );
}

function AppContent() {
  const { isDark, isDev } = useTheme();

  const appThemeClasses = isDev
    ? 'dark dev-mode bg-[#050b0b]'
    : isDark
      ? 'dark bg-[#0f0f14]'
      : 'bg-[#F5F1E8]';

  return (
    <Router>
      <div className={`App min-h-screen transition-colors duration-0 ${appThemeClasses}`}>
        <ScrollToHash />
        {isDev && <div className="dev-grid-overlay" />}
        {isDev && <div className="dev-scanline-overlay" />}
        <DevMatrixRain />
        <DevBootSequence />
        <div className="grain-overlay" />
        <Header />
        <DevRouteBadges />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/admin" element={<AdminImageGate><AdminDashboard /></AdminImageGate>} />
          </Routes>
        </main>
        <Footer />
        <DevHud />
        <DevCommandPalette />
        <CustomCursor />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SiteContentProvider>
        <AppContent />
      </SiteContentProvider>
    </ThemeProvider>
  );
}

export default App;
