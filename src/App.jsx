import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import BlogPreview from './components/BlogPreview';
import ProjectsPreview from './components/ProjectsPreview';
import Experience from './components/Experience';
import Newsletter from './components/Newsletter';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BlogPage from './components/BlogPage';
import BlogPost from './components/BlogPost';
import LeadGenPopup from './components/LeadGenPopup';
import Chatbot from './components/Chatbot';
import ProjectsPage from './components/ProjectsPage';

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <ProjectsPreview />
      <BlogPreview />
      <Experience />
      <Newsletter />
      <Contact />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-[#0f0f0f] text-white min-h-screen selection:bg-orange-500/30 overflow-x-hidden">
        <Navbar />
        <main className="relative z-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </main>
        <Footer />
        <LeadGenPopup />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
