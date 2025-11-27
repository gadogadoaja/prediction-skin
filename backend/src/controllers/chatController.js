const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ChromaClient } = require("chromadb");
require('dotenv').config();

// KONFIGURASI 
const apiKey = process.env.VITE_GEMINI_API_KEY;
const chromaUrl = process.env.CHROMA_DB_URL || "http://localhost:8000";
const COLLECTION_NAME = "penyakit_skin_care";

if (!apiKey) {
  console.error("⚠️  Peringatan: GEMINI_API_KEY belum diset di backend/.env");
}

// INISIALISASI CLIENT 
const genAI = new GoogleGenerativeAI(apiKey);
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
const chromaClient = new ChromaClient({ path: chromaUrl });

// Test Health 
const testHealth = (req, res) => {
  res.status(200).json({ message: "DermaSmart Backend Ready!" });
};

// --- RAG Chat Handler (Untuk Chatbot) ---
const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Pesan kosong" });

    console.log(`📩 Chat Query: "${message}"`);

    // Embedding
    const embeddingResult = await embeddingModel.embedContent(message);
    const queryVector = embeddingResult.embedding.values;

    // Pencarian di ChromaDB
    let contextText = "";
    try {
      const collection = await chromaClient.getCollection({ name: COLLECTION_NAME });
      const searchResults = await collection.query({
        queryEmbeddings: [queryVector],
        nResults: 3, 
      });
      contextText = searchResults.documents[0] ? searchResults.documents[0].join("\n\n---\n\n") : "";
    } catch (e) {
      console.log("⚠️ Database belum siap, mode fallback.");
    }

    // Prompt Gemini
      const systemPrompt = `
        Anda adalah asisten medis spesialis kulit (Dermatologi) profesional untuk aplikasi DermaSmart AI.
        Tugas Anda adalah menjawab pertanyaan pengguna dengan akurat menggunakan referensi yang diberikan.
        Anda diciptakan oleh Aprizal dan M.Fais, jika masuk ke promt selanjutnya, jangan sebutkan lagi, siapa yang menciptakanmu

        INFORMASI REFERENSI (Dari Dokumen Medis Valid):
        ${contextText}

        PERTANYAAN PENGGUNA:
        ${message}

        INFORMASI REFERENSI nama penyakit yang diagnosis '${label}'
        

        PANDUAN MENJAWAB:
        1. Jawablah dengan sopan, empatik, dan menggunakan Bahasa Indonesia yang baik.
        2. UTAMAKAN informasi dari bagian "INFORMASI REFERENSI" di atas.
        3. Jika informasi spesifik tidak ditemukan di referensi, katakan: "Maaf, berdasarkan dokumen yang saya pelajari, saya tidak menemukan informasi spesifik mengenai hal tersebut. Sebaiknya konsultasikan langsung dengan dokter spesialis."
        4. Jangan membuat diagnosis medis final, selalu sarankan pemeriksaan fisik jika gejalanya parah.
        5. Untuk pertanyaan kedua dan seterusnya, langsung saja kasih jawabannya kepada pengguna, tanpa menjelaskan siapa anda dan 'Berdasarkan informasi yang saya pelajari dari dokumen medis'.
        6. Jika ada pertanyaan Saran untuk pengobatan, buatkan dalam markdown untuk jawabannya, contohnya seperti 1. A, 2.B
        7. Jika ada pertanyaan yang berkaitan dengan hasil diagnosis atau prediksi AI, ambil referensi nama penyakitnya dari '${label}'
      `;

    // Generate
    const result = await chatModel.generateContent(systemPrompt);
    const response = await result.response;
    
    res.status(200).json({ reply: response.text() });

  } catch (error) {
    console.error("❌ Error Chat:", error);
    res.status(500).json({ error: "Terjadi kesalahan sistem." });
  }
};

// Analisis Terstruktur (Untuk AI Scanner) 
const handleAnalysis = async (req, res) => {
  try {
    const { label } = req.body; // Contoh input: "Melanoma"

    if (!label) {
      return res.status(400).json({ error: "Label penyakit tidak boleh kosong" });
    }

    console.log(`🔬 Menganalisis Penyakit: "${label}"`);

    // informasi penyakit ini di PDF RAG
    // Kita buat query buatan agar pencariannya akurat
    const searchPrompt = `Penjelasan detail, penyebab, pengobatan, dan tingkat bahaya dari penyakit ${label}`;
    const embeddingResult = await embeddingModel.embedContent(searchPrompt);
    const queryVector = embeddingResult.embedding.values;

    let contextText = "";
    try {
      const collection = await chromaClient.getCollection({ name: COLLECTION_NAME });
      const searchResults = await collection.query({
        queryEmbeddings: [queryVector],
        nResults: 3, // potongan teks paling relevan
      });
      contextText = searchResults.documents[0] ? searchResults.documents[0].join("\n\n") : "";
    } catch (e) {
      console.log("⚠️ Database belum siap, menggunakan pengetahuan umum Gemini.");
    }

    // Prompt Khusus Format JSON
    // Kita instruksikan Gemini untuk menjadi "Data Extractor"
    const systemPrompt = `
      Tugas Anda adalah mengekstrak informasi medis tentang penyakit kulit: "${label}".
      Gunakan informasi dari KONTEKS REFERENSI di bawah ini.
      
      INSTRUKSI PENTING:
      1. Output WAJIB dalam format JSON murni (tanpa markdown \`\`\`json).
      2. Gunakan Bahasa Indonesia.
      3. Isinya harus ringkas, padat, dan langsung pada intinya (jangan bertele-tele).
      5. Jika label ada Label 'Unknown Normal' jawab: ini tidak berhubungan dengan Dermatologi kami.
      
      Format JSON yang diminta:
      {
        "description": "Penjelasan singkat tentang penyakit ini (maks 2 kalimat).",
        "causes": "Penyebab utama (poin-poin singkat).",
        "treatments": "Saran pengobatan medis & perawatan di rumah.",
        "urgency": "Tingkat Urgensi (pilih satu: Rendah / Sedang / Tinggi / Darurat Medis) dan alasan singkat."
      }

      KONTEKS REFERENSI:
      ${contextText}
    `;

    const result = await chatModel.generateContent(systemPrompt);
    const responseText = result.response.text();
    
    // Bersihkan format jika Gemini tidak sengaja menambahkan markdown
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData;
    try {
        parsedData = JSON.parse(cleanJson);
    } catch (e) {
        // Fallback jika Gemini gagal bikin JSON valid
        console.error("Gagal parse JSON dari Gemini:", responseText);
        parsedData = {
            description: `Informasi detil tentang ${label} belum tersedia dalam format terstruktur.`,
            causes: "-",
            treatments: "-",
            urgency: "Periksa ke dokter"
        };
    }

    res.status(200).json(parsedData);

  } catch (error) {
    console.error("❌ Error Analysis:", error);
    res.status(500).json({ 
      description: "Gagal mengambil data.", 
      causes: "-", 
      treatments: "-", 
      urgency: "Unknown" 
    });
  }
};

module.exports = {
  testHealth,
  handleChat,
  handleAnalysis 
};