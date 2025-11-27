const fs = require('fs');
const pdf = require('pdf-parse');
const { ChromaClient } = require("chromadb");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// KONFIGURASI Data
const PDF_PATH = './data/penyakit.pdf'; 
const COLLECTION_NAME = "penyakit_skin_care";

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
const client = new ChromaClient({ path: "http://localhost:8000" });

async function seedDatabase() {
  console.log("🚀 Memulai proses seeding data dari PDF...");

  try {
    // Proses Baca File PDF
    if (!fs.existsSync(PDF_PATH)) {
      throw new Error(`File PDF tidak ditemukan di ${PDF_PATH}. Buat folder 'data' di dalam backend dan masukkan file PDF Anda.`);
    }
    const dataBuffer = fs.readFileSync(PDF_PATH);
    const pdfData = await pdf(dataBuffer);
    const fullText = pdfData.text; // Mengambil semua teks dari PDF
    
    // Proses Bersihkan teks (hapus spasi berlebih/baris)
    const cleanText = fullText.replace(/\n\s*\n/g, '\n').trim();

    console.log(`📄 PDF terbaca. Panjang teks: ${cleanText.length} karakter.`);

    // Proses Chunking (Pecah teks panjang menjadi potongan kecil)
    const chunks = [];
    const chunkSize = 800; // Ukuran karakter per chunk
    for (let i = 0; i < cleanText.length; i += chunkSize) {
      chunks.push(cleanText.slice(i, i + chunkSize));
    }
    console.log(`🔪 Teks dipecah menjadi ${chunks.length} potongan (chunks).`);

    // Reset Koleksi (Hapus data lama biar bersih)
    try {
      await client.deleteCollection({ name: COLLECTION_NAME });
      console.log("🗑️ Koleksi lama dihapus (Reset).");
    } catch (e) {
      // Abaikan error jika koleksi belum ada
    }

    // Buat koleksi baru
    const collection = await client.getOrCreateCollection({
      name: COLLECTION_NAME,
      metadata: { "hnsw:space": "cosine" }
    });
    console.log("✨ Koleksi baru siap.");

    // Proses Embedding & Simpan ke ChromaDB
    console.log("⏳ Sedang membuat embedding (ini butuh waktu tergantung koneksi internet)...");
    
    const ids = [];
    const embeddings = [];
    const documents = [];

    // Proses loop
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // Minta Gemini mengubah teks jadi vektor
      const result = await embeddingModel.embedContent(chunk);
      const vector = result.embedding.values;

      ids.push(`id_${i}`);
      embeddings.push(vector);
      documents.push(chunk);

      // Tampilkan titik progress biar gak dikira hang
      process.stdout.write("."); 
    }

    // Simpan semua ke ChromaDB
    await collection.add({
      ids: ids,
      embeddings: embeddings,
      documents: documents,
    });

    console.log("\n✅ SUKSES! Semua data penyakit sudah masuk ke database.");

  } catch (error) {
    console.error("\n❌ Gagal seeding database:", error);
  }
}

seedDatabase();