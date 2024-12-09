const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Kegiatan = sequelize.define('Kegiatan', {
  kegiatan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  penyelenggara_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'penyelenggara',
      key: 'penyelenggara_id',
    },
    onDelete: 'CASCADE',
  },
  nama_kegiatan: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tanggal_mulai: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tanggal_selesai: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  batas_pendaftaran: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  kuota: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'closed', 'finished'),
    allowNull: false,
  },
  lokasi: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'kegiatan',
  timestamps: false,
});

module.exports = Kegiatan;
