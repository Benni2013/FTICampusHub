const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();
const { Sertifikat, PanitiaKegiatan } = require('../models/RelasiTabel'); // Ensure your model is correctly referenced

// Route to fetch and display Sertifikat data
router.get('/', async (req, res) => {
  try {
    const sertifikatList = await Sertifikat.findAll({
      include: [{ model: PanitiaKegiatan }]
    });
    res.render('sertifikat', { sertifikatList });
  } catch (error) {
    console.error('Error fetching sertifikat data:', error.message);
    res.status(500).send('Terjadi kesalahan saat mengambil data sertifikat.');
  }
});

// Route to download a Sertifikat as a PDF
router.get('/download/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sertifikat = await Sertifikat.findByPk(id, {
      include: [PanitiaKegiatan]
    });

    if (!sertifikat) {
      return res.status(404).send('Sertifikat tidak ditemukan');
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="sertifikat-${sertifikat.nomor_sertifikat}.pdf"`);

    doc.pipe(res);

    // Header
    doc.fontSize(25).text('Sertifikat Penghargaan', { align: 'center' });
    doc.image('path/to/your/logo.png', {
      fit: [150, 150],
      align: 'center'
    });

    // Body
    doc.fontSize(16).moveDown().text(`Diberikan kepada:`, { align: 'left' });
    doc.fontSize(20).text(`${sertifikat.PanitiaKegiatan.User.nama}`, { align: 'center' });

    doc.fontSize(14).moveDown().text(`Untuk partisipasi yang berharga sebagai:`, { align: 'left' });
    doc.fontSize(16).text(`${sertifikat.PanitiaKegiatan.jabatan}`, { align: 'center' });

    doc.fontSize(14).moveDown().text(`Dalam kegiatan:`, { align: 'left' });
    doc.fontSize(18).text(`${sertifikat.PanitiaKegiatan.Kegiatan.nama_kegiatan}`, { align: 'center' });

    // Footer
    doc.fontSize(12).moveDown().text(`Dikeluarkan pada: ${new Date(sertifikat.tanggal_terbit).toLocaleDateString()}`, { align: 'center' });

    // Close the PDF and end the response
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    res.status(500).send('Terjadi kesalahan saat membuat PDF.');
  }
});

module.exports = router;
