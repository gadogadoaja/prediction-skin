import React, { useState, useEffect, useRef } from 'react';
// Import fungsi baru yang memanggil backend
import { sendMessageToBackend } from '../utils/geminiService';

// --- BAGIAN IKON (Tosca Theme) ---
const RobotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="10" rx="2" className="fill-teal-500/20 stroke-teal-400" />
    <circle cx="12" cy="5" r="2" className="stroke-teal-400" />
    <path d="M12 7v4" className="stroke-teal-400" />
    <line x1="8" y1="16" x2="8" y2="16" className="stroke-teal-200 stroke-[3px]" />
    <line x1="16" y1="16" x2="16" y2="16" className="stroke-teal-200 stroke-[3px]" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 transform rotate-45" stroke="currentColor" strokeWidth="2">
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18" />
    <path d="M6 6L18 18" />
  </svg>
);

// --- KOMPONEN UTAMA ---
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Pesan awal
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: 'Halo! Saya asisten Dokter AI. Ada yang bisa dibantu?' 
    },
    {
      role: 'bot',
      text: 'Contoh: Apa obat untuk kulit gatal dan merah?'
    }
  ]);

  const messagesEndRef = useRef(null);
  
  // Auto-scroll ke bawah setiap ada pesan baru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // --- HANDLE KIRIM PESAN ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setIsLoading(true);

    // 1. Tampilkan pesan user di UI
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      // 2. Kirim ke Backend (Server yang mencari data di PDF)
      const botResponse = await sendMessageToBackend(userMsg);
      
      // 3. Tampilkan balasan dari Backend
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, server sedang sibuk atau tidak terhubung. Pastikan backend sudah jalan.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- TAMPILAN SAAT TERTUTUP (Tombol Bulat Tosca) ---
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#0D9488] hover:bg-[#0f766e] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group border-none"
      >
        <ChatIcon />
        <span className="absolute right-full mr-3 bg-gray-800 text-[#ffffff] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Tanya Dokter AI
        </span>
      </button>
    );
  }

  // --- TAMPILAN SAAT TERBUKA (Jendela Chat) ---
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[350px] md:w-[380px] h-[500px] flex flex-col bg-[#2B2D31] rounded-xl shadow-2xl border border-gray-700 overflow-hidden font-sans animate-fade-in-up">
      
      {/* HEADER */}
      <div className="bg-[#313338] p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 border rounded-full bg-teal-900/50 border-teal-500/30">
            <RobotIcon />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Asisten Dokter AI</h3>
            <span className="flex items-center gap-1 text-[10px] text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-[#0D9488] transition-colors p-1 hover:bg-gray-700 rounded"
        >
          <XIcon />
        </button>
      </div>

      {/* LIST PESAN (CHAT AREA) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#2B2D31]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 text-sm rounded-2xl leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#0D9488] text-white rounded-br-none' // Bubble User: Tosca
                  : 'bg-[#383A40] text-gray-200 border border-gray-600 rounded-tl-none' // Bubble Bot: Dark Grey
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
             <div className="bg-[#383A40] p-3 rounded-2xl rounded-tl-none border border-gray-600 text-gray-400 text-xs italic flex items-center gap-2">
               <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
               Sedang membaca referensi medis...
             </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-3 bg-[#313338] border-t border-gray-700">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            placeholder={isLoading ? "Tunggu sebentar..." : "Ketik keluhan kulit..."}
            className="w-full bg-[#1E1F22] text-gray-200 pl-4 pr-10 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] placeholder-gray-500 text-sm disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            <SendIcon />
          </button>
        </div>
        <div className="mt-2 text-center">
            <span className="text-[10px] text-gray-500">Powered by DermaSmart AI Indonesia</span>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;