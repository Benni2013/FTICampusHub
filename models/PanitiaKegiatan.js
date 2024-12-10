const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Pastikan konfigurasi sequelize benar

// PANITIA_KEGIATAN Model
const PanitiaKegiatan = sequelize.define('PanitiaKegiatan', {
    panitia_kegiatan_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    kegiatan_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },

    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },

    jabatan: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
}, {
    tableName: 'panitia_kegiatan',
    timestamps: false,
});

module.exports = PanitiaKegiatan;