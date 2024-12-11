// Router Mahasiswa dan Panitia
var express = require('express');
var router = express.Router();
const { Users, Kegiatan, Pendaftaran, Penyelenggara } = require('../models/RelasiTabel');

router.get('/home', async (req, res, next) => {
    try {
        let user_id = req.query.user;
        let user = await Users.findOne({ where: { user_id } });

        let kegiatan = await Kegiatan.findAll();

        res.render('./home_mhs.hbs', { 
            title: 'Dashboard Mahasiswa', 
            layout: "layouts/main", 
            data: {user, kegiatan}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred' });
    }
    
});


router.get('/pengumuman', async (req, res, next) => {
    try {
        let user_id = req.query.user;
        let user = await Users.findOne({ where: { user_id } });

        // Fetch pendaftaran data including related kegiatan and penyelenggara
        let pendaftaran = await Pendaftaran.findAll({
            where: { user_id },
            include: [{
                model: Kegiatan,
                include: [Penyelenggara]
            }],
            order: [['waktu_daftar', 'DESC']]
        });

        // Format data for easier access in the template
        let dataPendaftaran = pendaftaran.map(item => ({
            nama_kegiatan: item.Kegiatan.nama_kegiatan,
            waktu_daftar: item.waktu_daftar,
            nama_penyelenggara: item.Kegiatan.Penyelenggara.nama_penyelenggara,
            jabatan: item.jabatan,
            status: item.status
        }));

        console.log(dataPendaftaran);

        res.render('./pengumuman_mhs.hbs', {
            title: 'Pengumuman',
            layout: "layouts/main",
            data: { user, dataPendaftaran}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred' });
    }
});

router.get('/daftar', async (req, res, next) => {
    try {
        let user_id = req.query.user;
        let user = await Users.findOne({ where: { user_id } });

        let kegiatan_id = req.query.kegiatan;
        let kegiatan = await Kegiatan.findByPk(kegiatan_id);

        // console.log(kegiatan);

        res.render('./daftar_mhs.hbs', { 
            title: 'Pendaftaran', 
            layout: "layouts/main",
            data: { user, kegiatan }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred' });
    }
    
});

module.exports = router;