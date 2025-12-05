import React from 'react';
// Import komponen UI
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Doctors from './components/Doctors';
import Footer from './components/Footer';
import HowItWorks from './components/HowItWorks';
import ChatBot from './components/ChatBot';  // Import komponen AI 
import AIScanner from './components/AIScanner'; // Import from AIScanner

export default function App() {
  return (
    <div className="font-sans bg-white text-slate-800 scroll-smooth">
      {/* Menu Navigasi */}
      <Navbar />
      
      {/* Konten */}
      <Hero />
      
      {/* Penjelasan Fitur */}
      <Features />
      
      {/* Pejelasan Penggunaan Aplikasi*/}
      <HowItWorks />

      {/* AI SCANNER  */}
      <AIScanner />
      
      {/* Daftar Dokter */}
      <Doctors />
      
      {/* Footer*/}
      <Footer />

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}