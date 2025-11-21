import React, { useState, useEffect, useRef } from 'react';
import { Upload, Scan, CheckCircle, AlertTriangle, Activity, Sparkles } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import ReactMarkdown from 'react-markdown'; // Pastikan sudah install: npm install react-markdown

// Import Knowledge Base & Gemini Service
import { skinKnowledgeBase } from '../data/skinDatabase';
import { askGeminiSkinDoctor } from '../utils/geminiService';

const AIScanner = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  
  // State untuk LLM (Gemini)
  const [geminiAnalysis, setGeminiAnalysis] = useState("");
  const [loadingGemini, setLoadingGemini] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const imageRef = useRef(null);

  // DAFTAR KELAS (Harus urut sesuai model Python)
  const CLASSES = [
    'Blackheads', 
    'Cyst', 
    'Papules', 
    'Pustules',
    'Whiteheads'
  ];

  // --- FUNGSI LOADER MANUAL (Anti-Error Keras v3) ---
  const loadModelManual = async () => {
    const modelUrl = '/model/model.json';
    const weightBaseUrl = `${window.location.origin}/model/`;

    try {
      console.log("Memulai Custom Loader...");
      const response = await fetch(modelUrl);
      const modelJSON = await response.json();

      // Patch Input Shape jika hilang
      const inputShape = [null, 224, 224, 3];
      const patchLayer = (layers) => {
        if (layers && layers[0] && layers[0].config && !layers[0].config.batch_input_shape) {
            layers[0].config.batch_input_shape = inputShape;
            return true;
        }
        return false;
      };

      if (modelJSON?.config?.layers) patchLayer(modelJSON.config.layers);
      else if (modelJSON?.modelTopology?.config?.layers) patchLayer(modelJSON.modelTopology.config.layers);
      else if (modelJSON?.modelTopology?.modelConfig?.config?.layers) patchLayer(modelJSON.modelTopology.modelConfig.config.layers);

      // Custom IO Handler untuk fetch weights manual
      const customIOHandler = {
        load: async () => {
            const weightManifest = modelJSON.weightsManifest;
            const weightBuffers = [];
            const weightSpecs = [];

            for (const group of weightManifest) {
                weightSpecs.push(...group.weights);
                for (const path of group.paths) {
                    const url = weightBaseUrl + path;
                    const resp = await fetch(url);
                    const buffer = await resp.arrayBuffer();
                    weightBuffers.push(new Uint8Array(buffer));
                }
            }

            const totalLength = weightBuffers.reduce((acc, buf) => acc + buf.length, 0);
            const combinedBuffer = new Uint8Array(totalLength);
            let offset = 0;
            for (const buf of weightBuffers) {
                combinedBuffer.set(buf, offset);
                offset += buf.length;
            }

            return {
                modelTopology: modelJSON.modelTopology || modelJSON,
                weightSpecs: weightSpecs,
                weightData: combinedBuffer.buffer,
            };
        }
      };

      const loadedModel = await tf.loadLayersModel(customIOHandler);
      return loadedModel;
    } catch (err) {
      throw new Error("Gagal di Custom Loader: " + err.message);
    }
  };

  // Load Model saat Start
  useEffect(() => {
    const initModel = async () => {
      try {
        // Coba GraphModel dulu
        try {
            const loadedModel = await tf.loadGraphModel('/model/model.json');
            setModel(loadedModel);
            setModelLoading(false);
            return;
        } catch(e) {
            console.log("Bukan GraphModel, mencoba Custom Loader...");
        }
        // Fallback ke Custom Loader
        const loadedModel = await loadModelManual();
        setModel(loadedModel);
        setModelLoading(false);
      } catch (error) {
        console.error("Error memuat model:", error);
        setModelLoading(false);
      }
    };
    initModel();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImage(file);
      setResult(null);
      setGeminiAnalysis(""); // Reset LLM
    }
  };

  // --- LOGIKA UTAMA (TF + RAG) ---
  const startAnalysis = async () => {
    if (!model || !imageRef.current) return;
    setAnalyzing(true);
    setResult(null);
    setGeminiAnalysis("");
    setShowFullAnalysis(false);

    // Delay simulasi UI
    setTimeout(async () => {
      try {
        // 1. PREDIKSI VISUAL (TensorFlow)
        const tensor = tf.tidy(() => {
          let img = tf.browser.fromPixels(imageRef.current);
          img = tf.image.resizeBilinear(img, [224, 224]); 
          img = img.div(tf.scalar(255.0));
          return img.expandDims(0);
        });

        let prediction;
        if (model.predict) {
            prediction = await model.predict(tensor).data();
        } else if (model.execute) {
            prediction = await model.execute(tensor).data();
        }
        
        const maxProbability = Math.max(...prediction);
        const classIndex = prediction.indexOf(maxProbability);
        const detectedLabel = CLASSES[classIndex] || "Tidak Dikenali";
        const confidenceScore = (maxProbability * 100).toFixed(2);

        setResult({
          condition: detectedLabel,
          confidence: confidenceScore
        });

        tensor.dispose();
        setAnalyzing(false);

        // 2. ANALISIS DOKTER AI (Gemini RAG)
        // Hanya panggil jika confidence > 50%
        if (maxProbability > 0.5) {
          const medicalContext = skinKnowledgeBase[detectedLabel] || {};
          const {
            description = "-",
            causes = "",
            treatments = "",
            urgency = ""
          } = medicalContext;

          const summary = [
            `**${detectedLabel}**`,
            description,
            "",
            "**Penyebab utama:**",
            causes || "-",
            "",
            "**Perawatan yang disarankan:**",
            treatments || "-",
            "",
            "**Urgensi:**",
            urgency || "-"
          ].join("\n");

          setGeminiAnalysis(summary);
          setShowFullAnalysis(false);
          setLoadingGemini(false);
        }

      } catch (err) {
        console.error("Error prediksi:", err);
        alert("Terjadi kesalahan saat memproses gambar.");
        setAnalyzing(false);
      }
    }, 1000);
  };

  const resetScan = () => {
    setPreviewUrl(null);
    setImage(null);
    setResult(null);
    setAnalyzing(false);
    setGeminiAnalysis("");
  };

  return (
    <section id="scan" className="relative py-24 overflow-hidden text-white bg-slate-900">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2dd4bf 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="relative z-10 max-w-4xl px-4 mx-auto">
        <div className="mb-12 text-center">
          <span className={`inline-block py-1 px-3 rounded-full text-xs font-bold tracking-wide uppercase mb-4 ${modelLoading ? 'bg-yellow-500/20 text-yellow-300' : 'bg-teal-500/20 text-teal-300'}`}>
            {modelLoading ? "Memuat Model AI..." : "• Dual AI Core Ready"}
          </span>
          <h2 className="mt-2 mb-4 text-3xl font-bold md:text-4xl">AI Skin Detector + Smart Doctor</h2>
          <p className="text-slate-300">Kombinasi Computer Vision untuk melihat & Generative AI untuk menjelaskan.</p>
        </div>

        <div className="p-6 border shadow-2xl bg-slate-800 rounded-3xl md:p-8 border-slate-700">
          {!previewUrl ? (
            <div className="relative flex flex-col items-center justify-center p-12 text-center transition border-2 border-dashed cursor-pointer border-slate-600 rounded-2xl hover:border-teal-500 hover:bg-slate-700/50 group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={modelLoading} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
              />
              <div className="flex items-center justify-center w-20 h-20 mb-4 transition rounded-full bg-slate-700 group-hover:bg-teal-600">
                {modelLoading ? <Activity className="animate-spin text-slate-400"/> : <Upload className="w-8 h-8 text-slate-300 group-hover:text-white" />}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{modelLoading ? "Loading..." : "Upload Foto Kulit"}</h3>
              <p className="text-sm text-slate-400">Format JPG/PNG. Pastikan fokus.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative overflow-hidden bg-black border rounded-xl aspect-square w-full max-w-[420px] md:max-w-[520px] mx-auto group border-slate-700">
                <img ref={imageRef} src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                {analyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-teal-900/60 backdrop-blur-sm">
                    <div className="w-16 h-16 mb-4 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                    <p className="font-mono tracking-widest text-teal-300 animate-pulse">VISION AI SCANNING...</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                {!result && !analyzing && (
                  <div className="space-y-6">
                     <div className="p-4 border rounded-lg bg-slate-700/50 border-slate-600">
                        <h4 className="flex items-center gap-2 mb-2 font-semibold"><CheckCircle size={16} className="text-teal-400"/> Foto Siap</h4>
                        <p className="text-sm text-slate-400">AI akan melakukan deteksi visual lalu memberikan penjelasan medis.</p>
                     </div>
                     <button onClick={startAnalysis} disabled={!model} className="flex items-center justify-center w-full gap-2 py-4 font-bold text-white transition bg-teal-600 shadow-lg hover:bg-teal-500 disabled:bg-slate-600 rounded-xl">
                        <Scan size={20} /> {model ? "Analisis Lengkap" : "Tunggu Model..."}
                      </button>
                      <button onClick={resetScan} className="w-full py-2 text-sm text-slate-400 hover:text-white">Ganti Foto</button>
                  </div>
                )}

                {result && (
                  <div className="duration-700 animate-in fade-in slide-in-from-bottom-4">
                    {/* HASIL VISION AI */}
                    <div className="pb-6 mb-6 border-b border-slate-700">
                      <p className="mb-2 text-xs tracking-widest uppercase text-slate-400">Visual Diagnosis</p>
                      <h3 className="mb-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white">{result.condition}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-3 py-1 font-mono text-sm text-teal-300 rounded-full bg-teal-500/20">Conf: {result.confidence}%</span>
                      </div>
                    </div>

                    {/* HASIL GENERATIVE AI (GEMINI) */}
                    <div className="p-4 border bg-slate-800/50 rounded-xl border-slate-600">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={18} className="text-purple-400" />
                            <h4 className="font-semibold text-purple-200">Analisis Dokter AI</h4>
                        </div>
                        
                        {loadingGemini ? (
                            <div className="flex items-center gap-3 py-4 text-sm text-slate-400">
                                <div className="w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
                                Sedang menyusun laporan medis...
                            </div>
                        ) : (
                          <>
                            <div className={`relative ${showFullAnalysis ? "" : "max-h-64 overflow-hidden"}`}>
                              {!showFullAnalysis && (
                                <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                              )}
                              <div className="leading-relaxed prose-sm prose whitespace-pre-wrap prose-invert max-w-none text-slate-300">
                                <ReactMarkdown>{geminiAnalysis || "Gagal memuat analisis dokter."}</ReactMarkdown>
                              </div>
                            </div>
                            {geminiAnalysis && geminiAnalysis.length > 200 && (
                              <button
                                onClick={() => setShowFullAnalysis(prev => !prev)}
                                className="px-3 py-2 mt-3 text-sm font-semibold text-teal-200 border border-teal-600 rounded-lg hover:bg-teal-600/20"
                              >
                                {showFullAnalysis ? "Tutup" : "Selengkapnya"}
                              </button>
                            )}
                          </>
                        )}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button onClick={resetScan} className="flex-1 py-3 text-sm font-semibold text-white transition bg-slate-700 hover:bg-slate-600 rounded-xl">Coba Lagi</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIScanner;
