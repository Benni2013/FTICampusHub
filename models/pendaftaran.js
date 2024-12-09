const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Pendaftaran = sequelize.define('Pendaftaran', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  kegiatan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'kegiatan',
      key: 'kegiatan_id',
    },
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.ENUM('accepted', 'rejected', 'pending'),
    defaultValue: 'pending',
    allowNull: false,
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  jabatan: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  alasan_pendaftaran: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  waktu_daftar: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  tableName: 'pendaftaran',
  timestamps: false,
});

module.exports = Pendaftaran;
