const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Pastikan konfigurasi sequelize benar

// PENGUMUMAN Model
const Pengumuman = sequelize.define('Pengumuman', {
    pengumuman_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    kegiatan_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },

    judul: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },

    deskripsi: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },

    waktu_pengumuman: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },

    file_path: { 
        type: DataTypes.STRING(255) 
    },
}, {
    tableName: 'pengumuman',
    timestamps: false,
});

module.exports = Pengumuman;