const PDFDocument = require('pdfkit');
const fs = require('fs');  // If you want to save the file to the server

function generateCertificate(sertifikatList) {
  // Create a new PDF document
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4'
  });

  // Pipe its output somewhere, like to a file or HTTP response
  // Here, we're saving to a file
  doc.pipe(fs.createWriteStream('output.pdf'));

  // Add some content to the document
  sertifikatList.forEach((sertifikat, index) => {
    if (index !== 0) doc.addPage({ size: 'A4', margin: 50 });  // Add a new page for each certificate if more than one

    doc.font('Helvetica-Bold')
       .fontSize(25)
       .text('Certificate of Completion', { align: 'center' });

    doc.moveDown(2);  // Add some space

    doc.font('Helvetica')
       .fontSize(18)
       .text(`${sertifikat.panitia_kegiatan.User.nama} has successfully participated in`, { align: 'center' });

    doc.font('Helvetica-Bold')
       .fontSize(20)
       .text(sertifikat.panitia_kegiatan.Kegiatan.nama_kegiatan, { align: 'center' });

    doc.font('Helvetica')
       .fontSize(18)
       .text(`and achieved the status of "${sertifikat.predikat}".`, { align: 'center' });

    doc.moveDown(1);
    doc.text('Congratulations!', { align: 'center' });

    // Optionally, add more details or a footer
    doc.moveDown(1);
    doc.font('Helvetica-Oblique')
       .fontSize(12)
       .fillColor('gray')
       .text('Thank you for your efforts and achievement.', { align: 'center' });

    // Add a signature line
    doc.moveDown(2);
    doc.strokeColor('#000000')
       .lineWidth(1)
       .moveTo(100, doc.y)
       .lineTo(300, doc.y)
       .stroke();
    doc.fontSize(12).text('Signature', 100, doc.y + 5, { align: 'left' });

    doc.fontSize(10).fillColor('black').text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
  });

  // Finalize PDF file
  doc.end();
}

// Example usage
const sertifikatList = [
  {
    panitia_kegiatan: {
      User: { nama: "John Doe" },
      Kegiatan: { nama_kegiatan: "Node.js Conference" }
    },
    predikat: "Excellent"
  }
];

generateCertificate(sertifikatList);