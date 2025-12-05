import React from 'react';
import { Scan, AlertCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="pt-16 pb-8 border-t bg-slate-50 border-slate-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-8 mb-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-teal-600">
              <Scan size={24} />
              <span className="text-xl font-bold text-slate-800">DermaSmart.AI</span>
            </div>
            <p className="max-w-sm mb-6 text-slate-500">
              Platform kesehatan kulit berbasis AI terdepan di Indonesia. Misi kami adalah mendemokratisasi akses ke skrining dermatologi awal untuk semua orang.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-bold text-slate-900">Layanan</h4>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#" className="hover:text-teal-600">AI Skin Check</a></li>
              <li><a href="#" className="hover:text-teal-600">Konsultasi Telemedisin</a></li>
              <li><a href="#" className="hover:text-teal-600">Ensiklopedia Kulit</a></li>
              <li><a href="#" className="hover:text-teal-600">Untuk Klinik & RS</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold text-slate-900">Legal</h4>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#" className="hover:text-teal-600">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-teal-600">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-teal-600">Disclaimer Medis</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-slate-200 md:flex-row">
          <p className="text-sm text-slate-500">© 2026 DermaSmart AI Indonesia. All rights reserved.</p>
          <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-orange-600 border border-orange-100 rounded-full bg-orange-50">
            <AlertCircle size={12} />
            <span>Disclaimer: Aplikasi ini untuk skrining awal, bukan diagnosis medis.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;