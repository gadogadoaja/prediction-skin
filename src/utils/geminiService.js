// Fungsi untuk memanggil Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // <-- MASUKKAN API KEY GEMINI ANDA DI SINI

export const askGeminiSkinDoctor = async (diseaseName, confidence, knowledgeContext) => {
  // 1. Cek API Key
  // Jika menggunakan Vite, sebaiknya gunakan import.meta.env.VITE_GEMINI_API_KEY
  // const apiKey = import.meta.env.VITE_GEMINI_API_KEY || API_KEY;
  
  const apiKey = API_KEY; // Untuk sementara hardcode atau ganti dengan cara di atas

  if (!apiKey) {
    return "Error: API Key Gemini belum dikonfigurasi.";
  }

  // 2. Konstruksi Prompt RAG
  // Kita menggabungkan Hasil Prediksi + Data Knowledge Base + Instruksi Persona
  const prompt = `
    Bertindaklah sebagai Dokter Spesialis Kulit (Dermatolog) yang ramah dan profesional.
    
    Konteks Pasien:
    - Hasil Deteksi AI: ${diseaseName}
    - Tingkat Keyakinan AI: ${confidence}%
    
    Referensi Medis (Gunakan ini sebagai dasar fakta):
    ${JSON.stringify(knowledgeContext)}
    
    Tugas:
    1. Jelaskan secara singkat apa itu ${diseaseName} dalam bahasa yang mudah dimengerti orang awam.
    2. Berikan 3-4 saran perawatan praktis yang bisa dilakukan di rumah berdasarkan referensi di atas.
    3. Berikan peringatan kapan harus ke dokter (berdasarkan tingkat urgensi).
    
    Gunakan format Markdown yang rapi (gunakan bullet points). Nada bicara harus menenangkan, empatik, namun tetap medis dan akurat.
    Hindari memberikan resep obat keras secara spesifik, sarankan kandungan aktifnya saja.
  `;

  // 3. Panggil API
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak dapat memberikan analisis saat ini.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Terjadi kesalahan saat menghubungi asisten dokter AI. Silakan coba lagi nanti.";
  }
};