// Router Penyelenggara
var express = require('express');
var router = express.Router();
const { Penyelenggara, Kegiatan, Pendaftaran, Users } = require('../models/RelasiTabel');
const { where } = require('sequelize');
const { Op } = require('sequelize');

router.get('/home', async (req, res, next) => {
    try {
        let penyelenggara_id = req.query.penyelenggara;
        const penyelenggara = await Penyelenggara.findByPk(penyelenggara_id);

        // Hitung jumlah kegiatan berdasarkan status
        const totalKegiatan = await Kegiatan.count({
            where: { penyelenggara_id }
        });

        const kegiatanAkanBerlangsung = await Kegiatan.count({
            where: { 
                penyelenggara_id,
                tanggal_mulai: { [Op.gt]: new Date() }, // Tanggal mulai akan berlalu
            }
        });

        const kegiatanBerlangsung = await Kegiatan.count({
            where: { 
                penyelenggara_id,
                tanggal_mulai: { [Op.lte]: new Date() }, // Tanggal mulai sudah berlalu
                tanggal_selesai: { [Op.gte]: new Date() } // Tanggal selesai belum tiba
            }
        });

        const kegiatanSelesai = await Kegiatan.count({
            where: { 
                penyelenggara_id,
                tanggal_selesai: { [Op.lt]: new Date() } // Tanggal selesai sudah berlalu
            }
        });

        res.render('./home_admin.hbs', { 
            title: 'Dashboard', 
            layout: "layouts/main_admin",
            data: {penyelenggara, totalKegiatan, kegiatanAkanBerlangsung, kegiatanBerlangsung, kegiatanSelesai}
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred \n' + error});
    }
});

router.get('/informasi_kegiatan', async (req, res, next) => {
    
    try {
        let penyelenggara_id = req.query.penyelenggara;
        const penyelenggara = await Penyelenggara.findByPk(penyelenggara_id);

        res.render('./informasi_admin.hbs', { 
            title: 'Informasi Kegiatan', 
            layout: "layouts/main_admin",
            data: {penyelenggara}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred \n' + error});
    }
});

router.get('/kelola_pendaftaran', async (req, res, next) => {
    
    try {
        let penyelenggara_id = req.query.penyelenggara;
        const penyelenggara = await Penyelenggara.findByPk(penyelenggara_id);

        const kegiatan = await Kegiatan.findAll({
            where:
            {penyelenggara_id}
        });

        res.render('./kelola_pendaftaran_admin.hbs', { 
            title: 'Kelola Pendaftaran', 
            layout: "layouts/main_admin",
            data: {penyelenggara, kegiatan}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred \n' + error});
    }
});

router.get('/kelola_pendaftaran/pendaftar', async (req, res, next) => {
    
    try {
        let penyelenggara_id = req.query.penyelenggara;
        let kegiatan_id = req.query.kegiatan;

        const penyelenggara = await Penyelenggara.findByPk(penyelenggara_id);

        const kegiatan = await Kegiatan.findByPk(kegiatan_id);

        const pendaftar = await Pendaftaran.findAll(
            {
                where: {kegiatan_id},
                include: [
                    { model: Users,
                        attributes: ['nim', 'nama', 'email', 'no_telp']
                     },  // Gunakan object untuk include
                    { model: Kegiatan }
                ],
                order: [['waktu_daftar', 'ASC']]
            }
        );

        let dataPendaftaran = pendaftar.map(item => ({
            nim: item.Users.nim,
            nama: item.Users.nama,
            email: item.Users.email,
            no_telp: item.Users.no_telp,
            alamat: item.alamat,
            nama_kegiatan: item.Kegiatan.nama_kegiatan,
            waktu_daftar: item.waktu_daftar,
            jabatan: item.jabatan,
            alasan: item.alasan_pendaftaran
        }));

        console.log(dataPendaftaran);

        res.render('./pendaftar_admin.hbs', { 
            title: 'Kelola Pendaftaran ' + kegiatan.nama_kegiatan, 
            layout: "layouts/main_admin",
            data: {penyelenggara, pendaftar}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred ' + error});
    }
});

router.get('/ProfileAdm', async (req, res, next) => {
    
    try {
        let penyelenggara_id = req.query.penyelenggara;
        const penyelenggara = await Penyelenggara.findByPk(penyelenggara_id);
        
        res.render('./Profile.hbs', { 
            title: 'Profile', 
            layout: "layouts/main_admin",
            data: {penyelenggara}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred \n' + error});
    }
});

module.exports = router;