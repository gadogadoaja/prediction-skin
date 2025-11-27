🩺 DermaSmart AI - Fullstack Skin Detection App

Aplikasi deteksi penyakit kulit menggunakan Computer Vision (TensorFlow.js) dan RAG Chatbot (Gemini AI + ChromaDB).

DermaSmart AI menggabungkan kecerdasan buatan visual dan tekstual untuk membantu deteksi dini masalah kulit serta memberikan konsultasi medis berbasis data yang akurat.

📋 Prasyarat (Wajib Install)

Sebelum menjalankan aplikasi, pastikan di komputer kamu sudah terinstall software berikut:

Docker Desktop (Wajib untuk menjalankan database ChromaDB).

Node.js (Untuk menjalankan server backend dan frontend).

🚀 Cara Menjalankan Proyek (Langkah demi Langkah)

Ikuti urutan langkah di bawah ini agar aplikasi berjalan lancar tanpa error.

Langkah 1: Setup Environment Variables (.env)

Kita perlu mengatur kunci API dan konfigurasi server terlebih dahulu.

Masuk ke folder backend/.

Buat file baru bernama .env.

Isi file tersebut dengan kode konfigurasi berikut:

PORT=5000
GEMINI_API_KEY=MASUKKAN_API_KEY_GEMINI_KAMU_DISINI
CHROMA_DB_URL=http://localhost:8000


Catatan: Ganti MASUKKAN_API_KEY_GEMINI_KAMU_DISINI dengan API Key asli dari Google AI Studio kamu.

Langkah 2: Menyalakan Database (Docker)

Database vektor (ChromaDB) berjalan di dalam container Docker.

Buka aplikasi Docker Desktop dan pastikan statusnya sudah Running.

Buka terminal (Command Prompt atau PowerShell), lalu jalankan perintah ini:

docker run -p 8000:8000 chromadb/chroma


⚠️ Penting: Biarkan terminal ini tetap terbuka selama kamu menggunakan aplikasi. Jangan ditutup!

Langkah 3: Mengisi Data Penyakit (Seeding)

Saat pertama kali dijalankan, database masih kosong. Kita perlu memasukkan data (seeding) dari file PDF ke dalam ChromaDB agar Chatbot memiliki pengetahuan (knowledge base).

Pastikan terminal Docker (Langkah 2) masih berjalan.

Buka terminal baru, lalu masuk ke folder backend.

Jalankan perintah berikut untuk mengisi database:

node src/utils/seedDatabase.js


Langkah 4: Menjalankan Aplikasi

Langkah terakhir adalah menyalakan Server Backend dan Frontend React. Kamu butuh dua terminal berbeda untuk ini.

A. Jalankan Backend Server
Di terminal yang berada di folder backend, jalankan:

npm start


(Server akan berjalan di port 5000)

B. Jalankan Frontend React
Buka terminal baru lagi, arahkan ke folder root (folder utama proyek), lalu jalankan:

npm run dev


(Aplikasi web akan terbuka di browser)

🎉 Selesai!

Aplikasi siap digunakan.

SELAMAT BEKERJA GESS! 🚀
