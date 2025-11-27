const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatController = require('./src/controllers/chatController');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (!chatController.handleAnalysis) {
  console.error("❌ ERROR: Fungsi handleAnalysis tidak ditemukan di chatController.js!");
  console.error("Pastikan Anda sudah menyimpan file chatController.js yang baru.");
  process.exit(1);
}

// --- ROUTES ---

// Cek Kesehatan Server
app.get('/', chatController.testHealth);

// Route Chat AI (Chatbot)
app.post('/api/chat', chatController.handleChat);

// Route Analisis Penyakit (AI Scanner)
app.post('/api/analyze', chatController.handleAnalysis); 

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 DermaSmart Backend Running`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`=================================`);
});