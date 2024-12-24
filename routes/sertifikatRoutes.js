// sertifikatRoutes.js
const express = require('express');
const router = express.Router();
const { Pendaftaran, Kegiatan, Penyelenggara, Users } = require('../models/RelasiTabel');
// const { layout } = require('pdfkit/js/page');
const PDFDocument = require('pdfkit');
const fs = require('fs');  // If you want to save the file to the server
const path = require('path');

// Fungsi helper untuk format tanggal
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};


router.get('/', async (req, res) => {
  try {
    const userId = req.query.user;
    
    const dataPendaftaran = await Pendaftaran.findAll({
      where: {
        user_id: userId,
        status: 'accepted'
      },
      include: [
        {
          model: Kegiatan,
          include: [
            {
              model: Penyelenggara,
              attributes: ['nama_penyelenggara', 'logo_path']
            }
          ]
        },
        {
          model: Users,
          attributes: ['nama']
        }
      ]
    });

    res.render('./sertifikat.hbs', {
      title: 'Sertifikat',
      layout: "layouts/main",
      data: {
        user: {
          user_id: userId
        },
        dataPendaftaran
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data sertifikat');
  }
});

// sertifikatRoutes.js
router.get('/download', async (req, res) => {
  try {
    const { kegiatan: kegiatanId, user: userId } = req.query;
    
    const pendaftaran = await Pendaftaran.findOne({
      where: {
        kegiatan_id: kegiatanId,
        user_id: userId,
        status: 'accepted'
      },
      include: [
        {
          model: Kegiatan,
          include: [
            {
              model: Penyelenggara,
              attributes: ['nama_penyelenggara', 'logo_path']
            }
          ]
        },
        {
          model: Users,
          attributes: ['nama']
        }
      ]
    });

    if (!pendaftaran) {
      return res.status(404).send('Data tidak ditemukan');
    }

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=sertifikat_${pendaftaran.Kegiatan.nama_kegiatan}.pdf`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add logo
    const logoPath = pendaftaran.Kegiatan.Penyelenggara.logo_path 
      ? path.join(__dirname, '..', 'public', 'pp_penyelenggara', pendaftaran.Kegiatan.Penyelenggara.logo_path)
      : path.join(__dirname, '..', 'public', 'pp_mahasiswa', 'pp_mahasiswa_default.png');

    // Set margins dan posisi awal
    const margin = 24;
    doc.page.margins = {
      top: margin,
      bottom: margin,
      left: margin,
      right: margin
    };

    // Add logo
    doc.image(logoPath, {
      fit: [100, 100],
      align: 'center'
    });

    // Add certificate content
    doc.moveDown(2);
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text('SERTIFIKAT', { align: 'center' });

    doc.moveDown();
    doc.fontSize(18)
       .font('Helvetica')
       .text(pendaftaran.Kegiatan.Penyelenggara.nama_penyelenggara, { align: 'center' });

    doc.moveDown();
    doc.fontSize(16)
       .text('Dengan bangga memberikan sertifikat kepada:', { align: 'center' });

    doc.moveDown();
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .text(pendaftaran.User.nama, { align: 'center' });

    doc.moveDown();
    doc.fontSize(16)
       .font('Helvetica')
       .text(`Sebagai ${pendaftaran.jabatan}`, { align: 'center' });

    doc.moveDown();
    doc.text('dalam kegiatan', { align: 'center' });

    doc.moveDown();
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .text(pendaftaran.Kegiatan.nama_kegiatan, { align: 'center' });

    doc.moveDown();
    doc.fontSize(14)
       .font('Helvetica')
       .text(`Yang diselenggarakan pada ${formatDate(pendaftaran.Kegiatan.tanggal_mulai)} - ${formatDate(pendaftaran.Kegiatan.tanggal_selesai)}`, { align: 'center' });

    // Add signature section
    doc.moveDown(4);
    const currentY = doc.y;
    doc.fontSize(12)
       .text('Tertanda,', doc.page.width - 200, currentY, { align: 'center' })
       .moveDown(3)
       .text(pendaftaran.Kegiatan.Penyelenggara.nama_penyelenggara, doc.page.width - 200, doc.y, { align: 'center' });

    // Finalize PDF file
    doc.end();

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Terjadi kesalahan dalam menggenerate sertifikat');
  }
});

module.exports = router;
