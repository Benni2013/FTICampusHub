const { sequelize } = require('../models/RelasiTabel');
const { Kegiatan, Pendaftaran, Users, PanitiaKegiatan } = require('../models/RelasiTabel');

exports.createRegistration = async (req, res) => {
  const { user_id, kegiatan_id, alamat, jabatan, alasan_pendaftaran } = req.body;

  // Mulai transaksi
  const transaction = await sequelize.transaction();

  try {
    // Validasi apakah kegiatan ada
    const kegiatan = await Kegiatan.findByPk(kegiatan_id, { transaction });
    if (!kegiatan) {
      return res
        .status(404)
        .json({ error: `Kegiatan dengan ID ${kegiatan_id} tidak ditemukan` });
    }

    // Validasi apakah user ada
    const user = await Users.findByPk(user_id, { transaction });
    if (!user) {
      return res
        .status(404)
        .json({ error: `User dengan ID ${user_id} tidak ditemukan` });
    }

    // Periksa apakah user sudah mendaftar
    const existingRegistration = await Pendaftaran.findOne({
      where: { user_id, kegiatan_id },
      transaction,
    });
    if (existingRegistration) {
      return res
        .status(400)
        .json({ error: 'User sudah terdaftar dalam kegiatan ini' });
    }

    // Buat pendaftaran
    const pendaftaran = await Pendaftaran.create(
      {
        user_id,
        kegiatan_id,
        alamat,
        jabatan,
        alasan_pendaftaran,
        waktu_daftar: new Date(), // Waktu pendaftaran otomatis
        status: 'pending', // Status default
      },
      { transaction }
    );

    // Commit transaksi
    await transaction.commit();

    // Kirim respons dengan data pendaftaran yang baru saja dibuat
    res.status(201).json({
      message: 'Pendaftaran berhasil',
      pendaftaran: {
        id: pendaftaran.id,
        user_id: pendaftaran.user_id,
        kegiatan_id: pendaftaran.kegiatan_id,
        alamat: pendaftaran.alamat,
        jabatan: pendaftaran.jabatan,
        alasan_pendaftaran: pendaftaran.alasan_pendaftaran,
        waktu_daftar: pendaftaran.waktu_daftar,
        status: pendaftaran.status,
      },
    });
  } catch (error) {
    // Rollback transaksi jika terjadi kesalahan
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk menyeleksi pendaftaran
exports.selectRegistration = async (req, res) => {
  const { user_id, kegiatan_id, status } = req.body;

  // Mulai transaksi
  const transaction = await sequelize.transaction();

  try {
    // Validasi apakah pendaftaran ada
    const pendaftaran = await Pendaftaran.findOne({
      where: { user_id, kegiatan_id },
      transaction,
    });

    if (!pendaftaran) {
      return res.status(404).json({ error: 'Pendaftaran tidak ditemukan' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' });
    }

    // Update status pendaftaran
    pendaftaran.status = status;
    await pendaftaran.save({ transaction });

    // Jika diterima, ubah role user menjadi panitia dan masukkan ke tabel PanitiaKegiatan
    if (status === 'accepted') {
      const user = await Users.findByPk(user_id, { transaction });
      if (!user) {
        throw new Error(`User dengan ID ${user_id} tidak ditemukan`);
      }

      // Ubah role user menjadi 'panitia'
      user.role = 'panitia';
      await user.save({ transaction });

      // Masukkan data ke tabel PanitiaKegiatan
      await PanitiaKegiatan.create(
        {
          kegiatan_id,
          user_id,
          jabatan: pendaftaran.jabatan, // Menggunakan jabatan dari pendaftaran
        },
        { transaction }
      );
    }

    // Commit transaksi
    await transaction.commit();

    res.status(200).json({
      message: `Pendaftaran berhasil diubah menjadi ${status}`,
      pendaftaran: {
        user_id: pendaftaran.user_id,
        kegiatan_id: pendaftaran.kegiatan_id,
        status: pendaftaran.status,
      },
    });
  } catch (error) {
    // Rollback transaksi jika ada kesalahan
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
