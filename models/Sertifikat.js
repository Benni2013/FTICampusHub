const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Pastikan konfigurasi sequelize benar

// SERTIFIKAT Model
const Sertifikat = sequelize.define('Sertifikat', {
    sertifikat_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    panitia_kegiatan_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },

    nomor_sertifikat: { 
        type: DataTypes.STRING(100), 
        allowNull: false, 
        unique: true 
    },

    file_path: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },

    tanggal_terbit: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
}, {
    tableName: 'sertifikat',
    timestamps: false,
});

module.exports = Sertifikat;