const { sequelize } = require('../models/RelasiTabel');
const { Pengumuman, Kegiatan } = require('../models/RelasiTabel');

// Fungsi untuk membuat pengumuman seleksi
exports.createAnnouncement = async (req, res) => {
  const { kegiatan_id, judul, deskripsi, file_path } = req.body;

  // Validasi apakah kegiatan ada
  const kegiatan = await Kegiatan.findByPk(kegiatan_id);
  if (!kegiatan) {
    return res.status(404).json({ error: `Kegiatan dengan ID ${kegiatan_id} tidak ditemukan` });
  }

  // Menyimpan pengumuman baru ke dalam tabel Pengumuman
  try {
    const pengumuman = await Pengumuman.create(
      {
        kegiatan_id,
        judul,
        deskripsi,
        waktu_pengumuman: new Date(), // Waktu pengumuman otomatis
        file_path: file_path || null,  // Jika ada file yang di-upload
      }
    );

    res.status(201).json({
      message: 'Pengumuman berhasil dibuat',
      pengumuman: {
        pengumuman_id: pengumuman.pengumuman_id,
        kegiatan_id: pengumuman.kegiatan_id,
        judul: pengumuman.judul,
        deskripsi: pengumuman.deskripsi,
        waktu_pengumuman: pengumuman.waktu_pengumuman,
        file_path: pengumuman.file_path,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
