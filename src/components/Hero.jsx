import React from 'react';
import { Activity, Camera } from 'lucide-react';

const Hero = () => {
  // Fungsi agar saat tombol diklik, halaman menggulir (scroll) dengan mulus
  const scrollToSection = (e, id) => {
    e.preventDefault(); // Mencegah perilaku default link agar bisa kita kontrol
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Bagian dengan id '${id}' tidak ditemukan.`);
    }
  };

  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden lg:pt-48 lg:pb-32">
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-bl from-teal-50 to-white rounded-bl-[100px] opacity-50"></div>
      <div className="grid items-center gap-12 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-semibold">
            <Activity size={16} />
            <span>Teknologi AI Kesehatan Terkini</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight lg:text-6xl text-slate-900">
            Deteksi Dini Kesehatan Kulit dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Kecerdasan Buatan</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-slate-600">
            Analisis kondisi kulit Anda dalam hitungan detik menggunakan teknologi Computer Vision dan Generative AI yang telah divalidasi oleh dermatolog. Cepat, privat, dan akurat.
          </p>
          
          {/* --- BAGIAN TOMBOL DIPERBAIKI DI SINI --- */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Tombol 1: Ke Scanner */}
            <a 
              href="#scan" 
              onClick={(e) => scrollToSection(e, 'scan')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white transition bg-teal-600 shadow-xl rounded-xl hover:bg-teal-700 shadow-teal-600/20"
            >
              <Camera size={20} />
              Mulai Analisis
            </a>
            
            {/* Tombol 2: Ke Cara Kerja (Diubah dari <button> ke <a>) */}
            <a 
              href="#how-it-works" 
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold transition bg-white border cursor-pointer text-slate-700 border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Pelajari Cara Kerja
            </a>
          </div>
          {/* ---------------------------------------- */}

          <div className="flex items-center gap-4 pt-4 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 overflow-hidden border-2 border-white rounded-full bg-slate-200">
                   <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
            <p>Dipercaya oleh 10.000+ pengguna</p>
          </div>
        </div>
        <div className="relative">
          <div className="relative z-10 p-6 transition duration-500 transform bg-white border shadow-2xl rounded-3xl border-slate-100 rotate-2 hover:rotate-0">
             <img 
              src="/model/foto/health2.jpg" 
              alt="Dermatology AI Interface" 
              className="rounded-2xl w-full h-[400px] object-cover"
            />
          </div>
          {/* Decorative Circles */}
          <div className="absolute w-64 h-64 bg-teal-100 rounded-full opacity-50 -top-10 -right-10 blur-3xl -z-10"></div>
          <div className="absolute w-64 h-64 bg-blue-100 rounded-full opacity-50 -bottom-10 -left-10 blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;