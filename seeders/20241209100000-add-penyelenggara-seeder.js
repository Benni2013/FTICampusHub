'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('penyelenggara', [
      {
        nama_penyelenggara: 'Fakultas Teknologi Informasi',
        email: 'fti@example.com',
        password: await bcrypt.hash('fti123', 10), 
        no_telp: '081234567890',
        deskripsi: 'Fakultas Teknologi Informasi memfasilitasi pembelajaran dan kegiatan berbasis teknologi.',
        logo_path: '',
        jenis: 'fakultas',
      },
      {
        nama_penyelenggara: 'Himpunan Mahasiswa Sistem Informasi',
        email: 'himasi@example.com',
        password: await bcrypt.hash('himasi123', 10),
        no_telp: '081345678901',
        deskripsi: 'Himpunan Mahasiswa Sistem Informasi mendukung pengembangan minat dan bakat mahasiswa.',
        logo_path: '',
        jenis: 'himpunan',
      },
      {
        nama_penyelenggara: 'Jurusan Sistem Informasi',
        email: 'esi@example.com',
        password: await bcrypt.hash('esi123', 10),
        no_telp: '083378678901',
        deskripsi: 'Jurusan Sistem Informasi.',
        logo_path: '',
        jenis: 'jurusan',
      },
      {
        nama_penyelenggara: 'Unit Kegiatan Mahasiswa Sistem Informasi',
        email: 'ukm@example.com',
        password: await bcrypt.hash('ukm123', 10), 
        no_telp: '083386478901',
        deskripsi: 'UKM Mahasiswa Sistem Informasi.',
        logo_path: '',
        jenis: 'ukm',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('penyelenggara', null, {});
  }
};
