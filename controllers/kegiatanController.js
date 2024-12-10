const { Kegiatan, Penyelenggara } = require('../models/RelasiTabel');

// Fungsi untuk menambah kegiatan
const tambahKegiatan = async (req, res) => {
  try {
    const {
      penyelenggara_id,
      nama_kegiatan,
      deskripsi,
      tanggal_mulai,
      tanggal_selesai,
      batas_pendaftaran,
      kuota,
      status,
      lokasi,
    } = req.body;

    // Validasi data wajib
    if (
      !penyelenggara_id ||
      !nama_kegiatan ||
      !tanggal_mulai ||
      !tanggal_selesai ||
      !batas_pendaftaran ||
      !kuota ||
      !status ||
      !lokasi
    ) {
      return res.status(400).json({ error: "Semua data wajib diisi!" });
    }

    // Validasi keberadaan penyelenggara
    const penyelenggara = await Penyelenggara.findByPk(penyelenggara_id);
    if (!penyelenggara) {
      return res.status(404).json({ error: "Penyelenggara tidak ditemukan" });
    }

    // Simpan data kegiatan ke database
    const kegiatanBaru = await Kegiatan.create({
      penyelenggara_id,
      nama_kegiatan,
      deskripsi,
      tanggal_mulai,
      tanggal_selesai,
      batas_pendaftaran,
      kuota,
      status,
      lokasi,
    });

    console.log('Data kegiatan baru:', kegiatanBaru); // Debug

    // Ambil data kegiatan beserta informasi relasi penyelenggara
    const kegiatanDetail = await Kegiatan.findByPk(kegiatanBaru.kegiatan_id, {
      include: [
        {
          model: Penyelenggara,
          attributes: ["nama_penyelenggara", "email", "no_telp", "jenis"],
        },
      ],
    });

    console.log('Detail kegiatan:', kegiatanDetail); // Debug

    res.status(201).json({
      message: "Kegiatan berhasil ditambahkan!",
      kegiatan: kegiatanDetail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

const lihatKegiatan = async (req, res) => {
  try {
    const { kegiatan_id } = req.params; // Ambil kegiatan_id dari parameter URL

    // Ambil data kegiatan berdasarkan kegiatan_id dengan informasi relasi penyelenggara
    const kegiatanDetail = await Kegiatan.findByPk(kegiatan_id, {
      include: [
        {
          model: Penyelenggara,
          attributes: ["nama_penyelenggara", "email", "no_telp", "jenis"],
        },
      ],
    });

    // Cek jika data kegiatan tidak ditemukan
    if (!kegiatanDetail) {
      return res.status(404).json({ error: "Kegiatan tidak ditemukan" });
    }

    // Kirimkan data kegiatan dalam format JSON
    res.status(200).json({
      message: "Detail kegiatan berhasil ditemukan!",
      kegiatan: kegiatanDetail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

module.exports = { tambahKegiatan, lihatKegiatan };
