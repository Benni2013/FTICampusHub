const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Pastikan konfigurasi sequelize benar

// USERS Model
const Users = sequelize.define('Users', {
    user_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    nama: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },

    nim: { 
        type: DataTypes.STRING(50) ,
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

    role: { 
        type: DataTypes.ENUM('mahasiswa','panitia'), 
        allowNull: true 
    },

    pp_path: { 
        type: DataTypes.STRING(255),
        allowNull: true
    },
}, {
    tableName: 'users',
    timestamps: false,
});

module.exports = Users;