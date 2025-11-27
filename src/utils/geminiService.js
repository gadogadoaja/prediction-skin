// Arahkan ke URL Backend Server Anda (Pastikan portnya sama dengan server.js)
const BACKEND_URL = "http://localhost:5000";

/**
 * Mengirim pesan chat ke Backend (Untuk Chatbot)
 * @param {string} message - Pesan dari user
 * @returns {Promise<string>} - Jawaban dari AI
 */
export const sendMessageToBackend = async (message) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server Error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply; 
  } catch (error) {
    console.error("Gagal menghubungi Backend Chat:", error);
    throw error;
  }
};

/**
 * Mengambil Analisis Penyakit dari Backend (Untuk AI Scanner)
 * @param {string} label - Label penyakit (misal: "Melanoma")
 * @returns {Promise<Object>} - Objek JSON { description, causes, treatments, urgency }
 */
export const analyzeSkinCondition = async (label) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label }),
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil analisis RAG");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error Analisis:", error);
    return {
      description: "Gagal mengambil data detil dari server.",
      causes: "-",
      treatments: "-",
      urgency: "Unknown"
    };
  }
};