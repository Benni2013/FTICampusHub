// Router Penyelenggara
var express = require("express");
var router = express.Router();
const { Penyelenggara, Kegiatan, Pendaftaran, Users } = require("../models/RelasiTabel");
const { where } = require("sequelize");
const { Op } = require("sequelize");

router.get("/home", async (req, res, next) => {
  try {
    let penyelenggara_id = req.query.penyelenggara;
    const penyelenggara = await Penyelenggara.findByPk(penyelenggara_id);

    // Hitung jumlah kegiatan berdasarkan status
    const totalKegiatan = await Kegiatan.count({
      where: { penyelenggara_id },
    });

    const kegiatanAkanBerlangsung = await Kegiatan.count({
      where: {
        penyelenggara_id,
        tanggal_mulai: { [Op.gt]: new Date() }, // Tanggal mulai akan berlalu
      },
    });

    const kegiatanBerlangsung = await Kegiatan.count({
      where: {
        penyelenggara_id,
        tanggal_mulai: { [Op.lte]: new Date() }, // Tanggal mulai sudah berlalu
        tanggal_selesai: { [Op.gte]: new Date() }, // Tanggal selesai belum tiba
      },
    });

    const kegiatanSelesai = await Kegiatan.count({
      where: {
        penyelenggara_id,
        tanggal_selesai: { [Op.lt]: new Date() }, // Tanggal selesai sudah berlalu
      },
    });

    res.render("./home_admin.hbs", {
      title: "Dashboard",
      layout: "layouts/main_admin",
      data: { penyelenggara, totalKegiatan, kegiatanAkanBerlangsung, kegiatanBerlangsung, kegiatanSelesai },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error occurred \n" + error });
  }
});

router.get("/informasi_kegiatan", async (req, res, next) => {
  try {
    let penyelenggara_id = req.query.penyelenggara;
    const penyelenggara = await Penyelenggara.findByPk(penyelenggara_id);

    res.render("./informasi_admin.hbs", {
      title: "Informasi Kegiatan",
      layout: "layouts/main_admin",
      data: { penyelenggara,  penyelenggara_id},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error occurred \n" + error });
  }
});

router.get("/kelola_pendaftaran", async (req, res, next) => {
  try {
    let penyelenggara_id = req.query.penyelenggara;
    const penyelenggara = await Penyelenggara.findByPk(penyelenggara_id);

    const kegiatan = await Kegiatan.findAll({
      where: { penyelenggara_id },
    });

    res.render("./kelola_pendaftaran_admin.hbs", {
      title: "Kelola Pendaftaran",
      layout: "layouts/main_admin",
      data: { penyelenggara, kegiatan },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error occurred \n" + error });
  }
});

router.get("/kelola_pendaftaran/pendaftar", async (req, res, next) => {
  try {
    let penyelenggara_id = req.query.penyelenggara;
    let kegiatan_id = req.query.kegiatan;

    const penyelenggara = await Penyelenggara.findByPk(penyelenggara_id);
    const kegiatan = await Kegiatan.findByPk(kegiatan_id);

    const pendaftar = await Pendaftaran.findAll({
      where: { kegiatan_id},
    });

    // Perkaya data pendaftar dengan informasi tambahan
    for (let pendaftarItem of pendaftar) {
      const user = await Users.findOne({
        where: { user_id: pendaftarItem.user_id },
      });
      if (user) {
        pendaftarItem.nama = user.nama;
        pendaftarItem.nim = user.nim;
        pendaftarItem.email = user.email;
        pendaftarItem.no_telp = user.no_telp;
      }

      const kegiatan = await Kegiatan.findOne({
        where: { kegiatan_id: pendaftarItem.kegiatan_id },
      });
      if (kegiatan) {
        pendaftarItem.nama_kegiatan = kegiatan.nama_kegiatan;
        pendaftarItem.deskripsi = kegiatan.deskripsi;
        pendaftarItem.tanggal_mulai = kegiatan.tanggal_mulai;
        pendaftarItem.penyelenggara_id = kegiatan.penyelenggara_id;
      }

      const penyelenggara = await Penyelenggara.findOne({
        where: { penyelenggara_id: pendaftarItem.penyelenggara_id },
      });
      if (penyelenggara) {
        pendaftarItem.nama_penyelenggara = penyelenggara.nama_penyelenggara;
      }
    }

    // Filter pendaftar dengan status ENUM 'accepted' atau 'rejected'
    const hasil = pendaftar.filter((item) => item.status === "accepted" || item.status === "rejected");
    const daftar = pendaftar.filter((item) => item.status === "pending");

    console.log("zzzzzzzzzz", daftar);

    res.render("./pendaftar_admin.hbs", {
      title: "Kelola Pendaftaran " + (kegiatan ? kegiatan.nama_kegiatan : ""),
      layout: "layouts/main_admin",
      data: { penyelenggara, pendaftar, hasil, daftar },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error occurred " + error });
  }
});

router.post("/penerimaan", async function (req, res, next) {
  try {
    const kegiatan_id = req.body.kegiatan_id;
    const user_id = req.body.user_id;
    const action = req.body.action;

    console.log("---------------" + kegiatan_id + user_id + action);
    // Validasi input
    if (!kegiatan_id || !user_id || !action) {
      return res.status(400).send("user_ID atau aksi tidak valid.");
    }

    let newStatus = "fr";
    if (action === "confirm") {
      newStatus = "accepted";
    } else if (action === "late") {
      newStatus = "rejected";
    }
    console.log("----------" + newStatus);

    // Perbarui status di database
    const updated = await Pendaftaran.update({ status: newStatus }, { where: { kegiatan_id, user_id } });

    if (updated[0] === 0) {
      return res.status(404).send("Pendaftaran tidak ditemukan.");
    }

    // Ambil parameter penyelenggara dan kegiatan dari query
    const penyelenggara = req.query.penyelenggara;
    const kegiatan = req.query.kegiatan;

    if (!penyelenggara || !kegiatan) {
      return res.status(400).send("Parameter penyelenggara atau kegiatan hilang.");
    }

    // Redirect dengan menyertakan query parameters
    res.redirect(`/penyelenggara/kelola_pendaftaran/pendaftar?penyelenggara=${penyelenggara}&kegiatan=${kegiatan}`);
  } catch (error) {
    console.error("Error saat memperbarui status pendaftaran:", error);
    res.status(500).send("Terjadi kesalahan saat memperbarui status.");
  }
});
router.post("/kelolakegiatan", async function (req, res, next) {
  try {
    const kegiatan_id = req.body.kegiatan_id;
    const action = req.body.action;

    console.log("---------------" + kegiatan_id + action);
    // Validasi input
    if (!kegiatan_id || !action) {
      return res.status(400).send("user_ID atau aksi tidak valid.");
    }

    let newStatus = "fr";
    if (action === "confirm") {
      newStatus = "closed";
    } else if (action === "late") {
      newStatus = "finished";
    }
    console.log("----------" + newStatus);

    // Perbarui status di database
    const updated = await Kegiatan.update({ status: newStatus }, { where: { kegiatan_id} });

    if (updated[0] === 0) {
      return res.status(404).send("Pendaftaran tidak ditemukan.");
    }

    // Ambil parameter penyelenggara dan kegiatan dari query
    const penyelenggara = req.query.penyelenggara;
    const kegiatan = req.query.kegiatan;

    if (!penyelenggara || !kegiatan) {
      return res.status(400).send("Parameter penyelenggara atau kegiatan hilang.");
    }

    // Redirect dengan menyertakan query parameters
    res.redirect(`/penyelenggara/kelola_pendaftaran?penyelenggara=${penyelenggara}&kegiatan=${kegiatan}`);
  } catch (error) {
    console.error("Error saat memperbarui status pendaftaran:", error);
    res.status(500).send("Terjadi kesalahan saat memperbarui status.");
  }
});

router.get("/ProfileAdm", async (req, res, next) => {
  try {
    let penyelenggara_id = req.query.penyelenggara;
    const penyelenggara = await Penyelenggara.findByPk(penyelenggara_id);

    res.render("./Profile.hbs", {
      title: "Profile",
      layout: "layouts/main_admin",
      data: { penyelenggara },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error occurred \n" + error });
  }
});

module.exports = router;
