// Ini adalah data "Ground Truth" untuk RAG
// Gemini akan menggunakan data ini sebagai referensi utama

export const skinKnowledgeBase = {
    'Blackheads': {
    description: "Bintik kecil hitam di permukaan kulit. Pori tersumbat tapi masih “terbuka”, sehingga sebum & kotoran teroksidasi → warnanya jadi hitam, bukan karena “kotoran” semata.",
    causes: "Produksi sebum berlebih, sel kulit mati menumpuk, Skincare / make up yang menyumbat pori (comedogenic), Jarang eksfoliasi / cleansing kurang optimal.",
    treatments: "Gunakan pembersih wajah yang lembut, obat jerawat yang mengandung BHA (salicylic acid) dan Retinoid topikal untuk bantu menarik minyak berlebih. Jangan memencet jerawat.",
    urgency: "Rendah, namun konsultasi dokter jika parah (kistik)."
  },
  'Cyst': {
    description: "Benjolan besar, dalam, sangat nyeri, kadang tidak selalu ada “kepala” di permukaan. Terjadi di lapisan kulit yang lebih dalam dan berisiko besar meninggalkan bopeng (scar).",
    causes: "Inflamasi berat di folikel rambut & kelenjar sebasea, faktor hormon kuat (misalnya remaja, PCOS, dsb), faktor genetik (riwayat jerawat berat di keluarga).",
    treatments: "Biasanya butuh dokter kulit untuk menanganinya.",
    urgency: "Tinggi, harus di periksakan ke dokter kulit"
  },
  'Papules': {
    description: "Benjolan kecil, padat, merah, tanpa titik nanah di atasnya. Ini jerawat meradang tahap awal.",
    causes: "Komedo yang tersumbat, dipicu bakteri C. acnes + respon imun dan sering muncul setelah komedo dipencet",
    treatments: "Jangan dipencet, gunakan benzoyl peroxide, retinoid, antibiotik topikal (sesuai resep) dan untuk jerawat pustular yang menyebar",
    urgency: "Sedang, Kalau jumlahnya banyak, nyeri, atau menyebar cepat sebaiknya ke dokter, penting ditangani sebelum berkembang jadi pustul atau meninggalkan bekas."
  },
  'Pustules': {
    description: "Jerawat merah dengan “kepala” putih/kuning berisi nanah. Ini jerawat meradang yang sudah berisi cairan inflamasi.",
    causes: "Progres lanjut dari papul yang meradang, bakteri C. acnes + respon imun terbentuk nanah (kumpulan sel darah putih), sering diperparah kebiasaan memencet/mengutak-atik kulit.",
    treatments: "Jangan dipencet, Topikal: benzoyl peroxide, retinoid, antibiotik topikal (sesuai resep) dan untuk jerawat yang pustules yang menyebar mungkin perlu antibiotik oral + regimen skincare khusus dari dokter.",
    urgency: "Sedang, Kalau hanya beberapa pustul dan masih bisa dikelola dengan OTC + perawatan yang benar. Dan harus ke dokter kalau Pustul sangat banyak / merata di wajah & tubuh, Menjadi sangat nyeri atau ada tanda infeksi berat (demam, nyeri hebat, bengkak ekstrem)."
  },
  'Whiteheads': {
    description: "Benjolan kecil putih atau sewarna kulit, permukaan tertutup. Pori tersumbat tapi “tertutup kulit”, sehingga isinya (sebum + sel kulit) tidak teroksidasi dan tetap putih.",
    causes: "Sebum berlebih, penumpukan sel kulit mati, produk kulit yang yang terlalu berat dan bisa dipicu perubahan hormon & gaya hidup.",
    treatments: "BHA (salicylic acid) atau AHA (glycolic/lactic) untuk eksfoliasi, hindari krim terlalu berat kalau kulit berminyak, jangan dipencet pakai kuku (risiko infeksi dan scar).",
    urgency: "Sedang, Kalau banyak sekali & bikin tekstur kulit sangat tidak rata segera konsultasi dokter."
  }
};
