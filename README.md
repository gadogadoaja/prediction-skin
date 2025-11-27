DermaSmart AI - Fullstack Skin Detection App
Aplikasi deteksi penyakit kulit menggunakan Computer Vision (TensorFlow.js) dan RAG Chatbot (Gemini AI + ChromaDB).
📋 Prasyarat (Wajib Install)
Sebelum menjalankan, pastikan di komputer sudah terinstall:
- Docker Desktop (untuk database ChromaDB).
  
🚀 Cara Menjalankan Proyek (Langkah demi Langkah)

Langkah 1: Setup Environment Variables (.env)
Di Folder Backend:
Buat file bernama .env di dalam folder backend/, isi dengan:
PORT=5000
GEMINI_API_KEY=MASUKKAN_API_KEY_GEMINI_KAMU_DISINI
CHROMA_DB_URL=http://localhost:8000

Langkah 2: Menyalakan Database (Docker)
Database vektor (ChromaDB) berjalan di Docker.
Buka aplikasi Docker Desktop dan pastikan sudah Running.
Buka terminal, jalankan perintah ini:
> docker run -p 8000:8000 chromadb/chroma <
(Biarkan terminal ini tetap terbuka).

Langkah 3: Mengisi Data Penyakit (Seeding)
Database kamu saat ini masih kosong. Kita perlu memasukkan data dari file PDF ke dalam ChromaDB agar Chatbot memiliki knowladge.
Pastikan terminal Docker (Langkah 3) sudah jalan.
Buka terminal baru di folder backend, jalankan:
> node src/utils/seedDatabase.js  <

Langkah 5: Menjalankan Aplikasi
-Jalankan Backend Server:
Di terminal folder backend:
> npm start <

-Jalankan Frontend React:
Di terminal folder root (utama):
> npm run dev <

SELAMAT BEKERJA GESS

Error "API Key not valid": Cek file .env kamu, pastikan key-nya benar dan tidak ada spasi.

Chatbot Error "Database belum siap": Pastikan Docker jalan DAN kamu sudah menjalankan langkah Seeding (Langkah 4).

Scanner Error: Pastikan backend server (port 5000) sedang menyala.

Selamat mencoba! 🚀
