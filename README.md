🩺 DermaSmart AI - Fullstack Skin Detection App

<div align="center">

</div>

Aplikasi deteksi penyakit kulit cerdas menggunakan Computer Vision dan RAG Chatbot.

DermaSmart AI adalah solusi kesehatan digital yang menggabungkan analisis gambar real-time (Computer Vision) dan konsultasi medis interaktif (Chatbot RAG) untuk membantu deteksi dini masalah kulit dengan akurasi berbasis data.

📑 Daftar Isi

Fitur Utama

Teknologi

Prasyarat

Instalasi & Penggunaan

Struktur Folder

✨ Fitur Utama

🔍 Deteksi Penyakit Kulit: Analisis visual instan menggunakan model Deep Learning TensorFlow.js.

💬 Smart Chatbot (RAG): Konsultasi medis kontekstual menggunakan Gemini AI yang terhubung dengan database medis (ChromaDB).

📚 Knowledge Base: Chatbot memiliki ingatan jangka panjang dari dokumen medis yang telah di-seed.

🛠 Teknologi

Komponen

Teknologi

Deskripsi

Frontend

React + Vite

Antarmuka pengguna yang cepat dan responsif.

Backend

Node.js + Express

API server untuk menangani request dan logika AI.

AI Vision

TensorFlow.js

Menjalankan model klasifikasi gambar langsung di browser.

AI Chat

Gemini AI + RAG

LLM canggih untuk pemahaman bahasa alami.

Database

ChromaDB

Vector Database untuk pencarian konteks medis yang cepat.

DevOps

Docker

Isolasi environment database agar mudah dijalankan.

📋 Prasyarat (Wajib Install)

Sebelum memulai, pastikan tools berikut sudah terinstall di komputermu:

Docker Desktop Wajib untuk menjalankan database ChromaDB.

Node.js (Versi 16 atau lebih baru) Runtime environment untuk menjalankan server backend dan frontend.

🚀 Cara Menjalankan Proyek (Langkah demi Langkah)

Ikuti panduan ini secara berurutan untuk pengalaman pengembangan yang lancar.

Langkah 1: Setup Environment Variables (.env)

Kita perlu mengatur kunci rahasia agar aplikasi bisa berkomunikasi dengan layanan Google AI.

Masuk ke folder backend/.

Buat file baru bernama .env.

Salin konfigurasi di bawah ini:

PORT=5000
GEMINI_API_KEY=MASUKKAN_API_KEY_GEMINI_KAMU_DISINI
CHROMA_DB_URL=http://localhost:8000


Tips: Dapatkan API Key gratis di Google AI Studio.

Langkah 2: Menyalakan Database (Docker)

Database vektor (ChromaDB) berjalan di dalam container Docker.

Buka aplikasi Docker Desktop (pastikan statusnya Running).

Jalankan perintah ini di terminal:

docker run -p 8000:8000 chromadb/chroma


⚠️ Penting: Biarkan terminal ini tetap terbuka selama kamu menggunakan aplikasi.

Langkah 3: Mengisi Data Penyakit (Seeding)

Saat pertama kali dijalankan, database masih kosong. Kita perlu "menyuapi" Chatbot dengan data medis.

Buka terminal baru (biarkan terminal Docker tetap jalan).

Masuk ke folder backend dan jalankan:

node src/utils/seedDatabase.js


Langkah 4: Menjalankan Aplikasi

Sekarang saatnya menyalakan mesin utama! Gunakan dua terminal terpisah.

A. Jalankan Backend Server
Di terminal folder backend:

npm start


(Server akan berjalan di port 5000)

B. Jalankan Frontend React
Buka terminal baru di folder root (folder utama proyek):

npm run dev


(Klik link localhost yang muncul untuk membuka aplikasi di browser)

📂 Struktur Folder

Gambaran singkat struktur proyek untuk memudahkan navigasi:

derma-smart/
├── backend/            # Server Node.js, Logika AI, & ChromaDB Client
│   ├── src/
│   │   ├── utils/      # Script seeding & helper fungsi
│   │   └── index.js    # Entry point server
│   └── .env            # File konfigurasi (TIDAK BOLEH DI-PUSH KE GITHUB)
├── src/                # Kode Frontend React (Komponen, Halaman, Aset)
├── package.json        # Daftar dependensi proyek
└── README.md           # Dokumentasi proyek ini


🎉 Selesai!

Aplikasi siap digunakan untuk mendeteksi dan berkonsultasi.

SELAMAT BEKERJA GESS! 🚀
