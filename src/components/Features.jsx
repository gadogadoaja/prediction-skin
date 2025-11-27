import React from 'react';
import { Brain, ShieldCheck, Activity } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-teal-600" />,
      title: "Deep Learning AI",
      desc: "Model kami dilatih dengan lebih dari 2 juta gambar klinis untuk mendeteksi 30+ jenis penyakit kulit umum."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-teal-600" />,
      title: "Privasi Terjamin",
      desc: "Foto Anda dienkripsi secara end-to-end dan tidak disimpan secara permanen di server kami tanpa izin."
    },
    {
      icon: <Activity className="w-8 h-8 text-teal-600" />,
      title: "Hasil Real-time",
      desc: "Dapatkan analisis awal dan saran perawatan dalam waktu kurang dari 5 detik setelah mengunggah foto."
    }
  ];

  return (
    <section id="technology" className="py-20 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">Teknologi Medis Masa Depan</h2>
          <p className="text-slate-600">Kombinasi keahlian dermatologi klinis dengan kecepatan komputasi modern.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="p-8 transition duration-300 border rounded-2xl bg-slate-50 border-slate-100 hover:shadow-xl hover:border-teal-100 group">
              <div className="flex items-center justify-center w-16 h-16 mb-6 transition bg-white shadow-sm rounded-2xl group-hover:scale-110">
                {f.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">{f.title}</h3>
              <p className="leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
