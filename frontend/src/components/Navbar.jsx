import React, { useState, useEffect } from 'react';
import { Scan, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-600">
            <Scan size={32} strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight text-slate-800">Derma<span className="text-teal-600">Smart</span>.AI</span>
          </div>
          
          <div className="items-center hidden gap-8 md:flex">
            <a href="#home" className="font-medium transition text-slate-600 hover:text-teal-600">Beranda</a>
            <a href="#technology" className="font-medium transition text-slate-600 hover:text-teal-600">Teknologi</a>
            <a href="#scan" className="font-medium transition text-slate-600 hover:text-teal-600">AI Scan</a>
            <a href="#doctors" className="font-medium transition text-slate-600 hover:text-teal-600">Dokter</a>
            <button className="px-5 py-2 font-medium text-white transition bg-teal-600 rounded-full shadow-lg hover:bg-teal-700 shadow-teal-600/20">
              Masuk Akun
            </button>
          </div>

          <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute flex flex-col w-full gap-4 p-4 bg-white border-t shadow-lg md:hidden border-slate-100">
          <a href="#home" className="font-medium text-slate-600">Beranda</a>
          <a href="#technology" className="font-medium text-slate-600">Teknologi</a>
          <a href="#scan" className="font-medium text-slate-600">AI Scan</a>
          <button className="w-full px-5 py-2 text-white bg-teal-600 rounded-full">Masuk Akun</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
