const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();
const { Sertifikat, PanitiaKegiatan } = require('../models/RelasiTabel'); // Pastikan model Sertifikat sudah benar

// Route untuk mendapatkan data sertifikat
router.get('/', async (req, res) => {
  try {
    // Ambil semua data sertifikat
    const sertifikatList = await Sertifikat.findAll({
      include: {
        model: PanitiaKegiatan
      }
    });

    // Render halaman sertifikat dengan data
    res.render('sertifikat', { sertifikatList });
  } catch (error) {
    console.error('Error fetching sertifikat data:', error.message);
    res.status(500).send('Terjadi kesalahan saat mengambil data sertifikat.');
  }
});

// Route untuk mendownload sertifikat dalam bentuk PDF
router.get('/download/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Ambil data sertifikat berdasarkan ID
    const sertifikat = await Sertifikat.findByPk(id);

    if (!sertifikat) {
      return res.status(404).send('Sertifikat tidak ditemukan');
    }

    // Buat dokumen PDF
    const doc = new PDFDocument();

    // Konfigurasi header response untuk download file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="sertifikat-${sertifikat.nomor_sertifikat}.pdf"`
    );

    // Streaming PDF langsung ke response
    doc.pipe(res);

    // Konten PDF
    doc.fontSize(20).text('Sertifikat', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Nomor Sertifikat: ${sertifikat.nomor_sertifikat}`);
    doc.text(`Panitia Kegiatan ID: ${sertifikat.panitia_kegiatan_id}`);
    doc.text(`Tanggal Terbit: ${new Date(sertifikat.tanggal_terbit).toLocaleDateString()}`);
    doc.moveDown();
    doc.text('Terima kasih atas partisipasi Anda.', { align: 'center' });

    // Selesai membuat PDF
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    res.status(500).send('Terjadi kesalahan saat membuat PDF.');
  }
});

module.exports = router;
