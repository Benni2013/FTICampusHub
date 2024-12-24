const express = require("express");
const router = express.Router();
const { tambahKegiatan, lihatKegiatan } = require("../controllers/kegiatanController");
const { Penyelenggara, Kegiatan, Pendaftaran, Users } = require("../models/RelasiTabel");

router.post("/tambah", async function (req, res) {
  try {
    const { penyelenggara_id, nama_kegiatan, deskripsi, tanggal_mulai, tanggal_selesai, batas_pendaftaran, kuota } = req.body;
    const penyelenggara = req.query.penyelenggara;

    console.log("-----------" + penyelenggara, penyelenggara_id, nama_kegiatan, deskripsi, tanggal_mulai, tanggal_selesai, batas_pendaftaran, kuota);
    // Validasi input
    if (!penyelenggara_id || !nama_kegiatan || !tanggal_mulai || !tanggal_selesai || !batas_pendaftaran || !kuota) {
      return res.status(400).send("Semua field wajib diisi.");
    }

    // Buat kegiatan baru
    const newKegiatan = await Kegiatan.create({
      nama_kegiatan,
      deskripsi,
      tanggal_mulai,
      tanggal_selesai,
      batas_pendaftaran,
      kuota,
      penyelenggara_id, // Tambahkan penyelenggara_id
      status: "published",
    });

    console.log("Kegiatan berhasil dibuat:", newKegiatan);

    res.redirect(`/penyelenggara/kelola_pendaftaran/pendaftar?penyelenggara=${penyelenggara_id}&kegiatan=${newKegiatan.id}`);
  } catch (error) {
    console.error("Error saat menambahkan kegiatan:", error);
    res.status(500).send("Terjadi kesalahan saat menambahkan kegiatan.");
  }
});

router.get("/:kegiatan_id", lihatKegiatan);

module.exports = router;
