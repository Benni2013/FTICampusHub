// Controller Authentication
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { Op } = require('sequelize'); // Import Op dari Sequelize
const User = require('../models/User');
const Penyelenggara = require('../models/Penyelenggara');

// Fungsi untuk membuat refresh token
const createRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Refresh token berlaku 7 hari
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    var isMatch, token;

    // Cari user berdasarkan email atau nim
    const user = await User.findOne({
      where: 
      { email: email } 
    });

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    } else {
      // Bandingkan password dengan hash di database
      isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Password salah' });
      } else {
            // Buat access token JWT jika password cocok
            token = jwt.sign(
              {
                id: user.id,
                nama: user.nama,
                email: user.email,
                nim: user.nim,
                role: user.role,
                no_telpon: user.no_telpon,
                pp_path: user.pp_path
              },
              process.env.JWT_SECRET,
              { expiresIn: '1h' } // Akses token berlaku 1 jam
            );
          
            // Buat refresh token
            const refreshToken = createRefreshToken(user.id);
      }
    }


    // Cari Penyelenggara
    const penyelenggara = await Penyelenggara.findOne({
      where:
      { email: email }
    });

    if (!penyelenggara) {
      return res.status(404).json({ message: 'Penyelengggara tidak ditemukan' });
    } else {
      // Bandingkan password dengan hash di database
      isMatch = await bcrypt.compare(password, penyelenggara.password);
    }

    



    // Set cookie dengan token
    res.cookie("token", token, { httpOnly: true });

    res.json({
      message: 'Login berhasil',
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nim: user.nim,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error during login:', err); // Logging error
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
};

// Endpoint untuk refresh token
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token diperlukan' });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Invalid refresh token:', err); // Logging error
      return res.status(403).json({ message: 'Refresh token tidak valid' });
    }

    const newAccessToken = jwt.sign(
      {
        id: decoded.userId, // Menggunakan userId dari token refresh
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: newAccessToken });
  });
};


module.exports = {
  login
}