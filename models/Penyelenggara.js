const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Pastikan konfigurasi sequelize benar

// PENYELENGGARA Model
const Penyelenggara = sequelize.define('Penyelenggara', {
    penyelenggara_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    nama_penyelenggara: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },

    email: { 
        type: DataTypes.STRING(100), 
        allowNull: false, 
        unique: true 
    },

    password: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },

    no_telp: { 
        type: DataTypes.STRING(15) 
    },

    deskripsi: { 
        type: DataTypes.TEXT 
    },

    logo_path: { 
        type: DataTypes.STRING(255) 
    },

    jenis: { 
        type: DataTypes.ENUM('fakultas','jurusan','himpunan','ukm'), 
        allowNull: false 
    },
}, {
    tableName: 'penyelenggara',
    timestamps: false,
});

module.exports = Penyelenggara;