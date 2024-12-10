const Pendaftaran = require('../models/Pendaftaran'); 
const Kegiatan = require('../models/Kegiatan'); 
const Users = require('../models/Users'); 

exports.createRegistration = async (req, res) => {
  const { user_id, kegiatan_id, alamat, jabatan, alasan_pendaftaran } = req.body;

  try {
    // Validasi apakah kegiatan ada
    const kegiatan = await Kegiatan.findByPk(kegiatan_id);
    if (!kegiatan) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    }

    // Validasi apakah user ada
    const users = await Users.findByPk(user_id);
    if (!users) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    // Periksa apakah user sudah mendaftar
    const existingRegistration = await Pendaftaran.findOne({ where: { user_id, kegiatan_id } });
    if (existingRegistration) {
      return res.status(400).json({ error: 'User sudah terdaftar dalam kegiatan ini' });
    }

    // Buat pendaftaran
    const pendaftaran = await Pendaftaran.create({
      user_id,
      kegiatan_id,
      alamat,
      jabatan,
      alasan_pendaftaran,
    });

    // Kembalikan data pendaftaran dengan relasi
    const pendaftaranDetail = await Pendaftaran.findByPk(pendaftaran.id, {
      include: [
        { model: Users, attributes: ['nama', 'email'] },
        { model: Kegiatan, attributes: ['nama_kegiatan', 'tanggal_mulai'] },
      ],
    });

    res.status(201).json({ message: 'Pendaftaran berhasil', pendaftaran: pendaftaranDetail });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
