const Kegiatan = require('../models/Kegiatan');

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

    // Validasi data
    if (!penyelenggara_id || !nama_kegiatan || !tanggal_mulai || !tanggal_selesai || !batas_pendaftaran || !kuota || !status || !lokasi) {
      return res.status(400).json({ error: 'Semua data wajib diisi!' });
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

    res.status(201).json({ message: 'Kegiatan berhasil ditambahkan!', kegiatan: kegiatanBaru });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = { tambahKegiatan };
