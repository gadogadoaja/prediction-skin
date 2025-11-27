🩺 DermaSmart AI

Aplikasi deteksi penyakit kulit (TensorFlow.js) + Chatbot Medis (Gemini AI).

⚠️ Prasyarat (Wajib)

Docker Desktop harus sudah Running.

Node.js sudah terinstall.

🚀 Cara Jalanin (Quick Start)

Butuh 3 Terminal berbeda. Jangan tutup terminal manapun saat aplikasi jalan.

1️⃣ Terminal 1: Database (Docker)

Buka terminal, jalankan perintah ini dan biarkan terbuka:

docker run -p 8000:8000 chromadb/chroma


2️⃣ Terminal 2: Backend

Masuk ke folder backend, lalu:

Buat file .env, isi dengan:

PORT=5000
GEMINI_API_KEY=MASUKKAN_KEY_GEMINI_DISINI
CHROMA_DB_URL=http://localhost:8000


Isi Data (Sekali saja saat pertama kali):

node src/utils/seedDatabase.js


Jalanin Server:

npm start


3️⃣ Terminal 3: Frontend

Masuk ke folder root (folder utama), lalu:

npm run dev


Selesai! Tinggal buka link localhost yang muncul di Terminal 3.
Selamat bekerja gess! 🚀
