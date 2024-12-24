const { Pendaftaran, Users, Kegiatan } = require('../models/RelasiTabel');

exports.getRiwayatKegiatan = async (req, res) => {
  const { pendaftaranId } = req.params;

  try {
    // Cari data pendaftaran berdasarkan id
    const pendaftaran = await Pendaftaran.findOne({
      where: { user_id: pendaftaranId },
      include: [
        {
          model: Users,
          attributes: ['user_id', 'nama', 'email'], // Menampilkan data pengguna
        },
        {
          model: Kegiatan,
          attributes: ['kegiatan_id', 'deskripsi'], // Hanya menampilkan id dan deskripsi kegiatan
        }
      ]
    });

    // Jika tidak ditemukan
    if (!pendaftaran) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan' });
    }

    // Mengembalikan riwayat kegiatan
    return res.status(200).json({
      message: 'Riwayat kegiatan ditemukan',
      riwayat: {
        pendaftaranId: pendaftaran.user_id,
        kegiatanId: pendaftaran.kegiatan_id,
        status: pendaftaran.status,
        alamat: pendaftaran.alamat,
        jabatan: pendaftaran.jabatan,
        alasan_pendaftaran: pendaftaran.alasan_pendaftaran,
        waktu_daftar: pendaftaran.waktu_daftar,
        user: pendaftaran.User,
        kegiatan: pendaftaran.Kegiatan
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};
