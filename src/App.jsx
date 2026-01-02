import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';

function App() {
  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen selection:bg-orange-500/30">
      <Navbar />
      <main className="relative z-0">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </div>
  )
}

export default App;
