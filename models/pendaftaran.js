const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// PENDAFTARAN Model
const Pendaftaran = sequelize.define(
  'Pendaftaran',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    kegiatan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM('accepted', 'rejected', 'pending'),
      allowNull: false,
      defaultValue: 'pending',
    },
    alamat: {
      type: DataTypes.TEXT,
    },
    jabatan: {
      type: DataTypes.STRING(100),
    },
    alasan_pendaftaran: {
      type: DataTypes.TEXT,
    },
    waktu_daftar: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'pendaftaran',
    timestamps: false,
  }
);

module.exports = Pendaftaran;
