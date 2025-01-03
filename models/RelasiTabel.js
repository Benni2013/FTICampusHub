const sequelize = require('../config/sequelize');
const Users = require('./Users');
const Penyelenggara = require('./Penyelenggara');
const Kegiatan = require('./kegiatan');
const PanitiaKegiatan = require('./PanitiaKegiatan');
const Pendaftaran = require('./pendaftaran');
const Sertifikat = require('./Sertifikat');
const Pengumuman = require('./Pengumuman');

// Define Relationships
Kegiatan.belongsTo(Penyelenggara, { foreignKey: 'penyelenggara_id' });
Penyelenggara.hasMany(Kegiatan, { foreignKey: 'penyelenggara_id' });

PanitiaKegiatan.belongsTo(Kegiatan, { foreignKey: 'kegiatan_id' });
PanitiaKegiatan.belongsTo(Users, { foreignKey: 'user_id' });
Pendaftaran.belongsTo(Users, { foreignKey: 'user_id' });
Pendaftaran.belongsTo(Kegiatan, { foreignKey: 'kegiatan_id' });
PanitiaKegiatan.hasOne(Sertifikat, { foreignKey: 'panitia_kegiatan_id' });
Sertifikat.belongsTo(PanitiaKegiatan, { foreignKey: 'panitia_kegiatan_id' });
Pengumuman.belongsTo(Kegiatan, { foreignKey: 'kegiatan_id' });

module.exports = {
    sequelize,
    Users,
    Penyelenggara,
    Kegiatan,
    PanitiaKegiatan,
    Pendaftaran,
    Sertifikat,
    Pengumuman,
};
