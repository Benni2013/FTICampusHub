<<<<<<< HEAD
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
=======
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const Penyelenggara = require('../models/Penyelenggara'); 

exports.register = async (req, res) => {
  const { nama, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const users = await Users.create({
      nama,
      email,
      role: 'mahasiswa',
      password: hashedPassword,
    });

    // res.status(201).json({ message: 'User registered successfully', users });
    console.log({ message: 'User registered successfully', users });
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek di tabel Users
    let user = await Users.findOne({ where: { email } });

    if (!user) {
      // Jika tidak ditemukan di Users, cek di tabel Penyelenggara
      const penyelenggara = await Penyelenggara.findOne({ where: { email } });

      if (!penyelenggara) {
        return res.status(404).json({ error: 'User or Organizer not found' });
      }

      // Validasi password untuk Penyelenggara
      const isPasswordValid = await bcrypt.compare(password, penyelenggara.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Email dan Password Salah' });
      }

      // Generate JWT untuk Penyelenggara
      const token = jwt.sign(
        { penyelenggaraId: penyelenggara.penyelenggara_id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      console.log({
        message: 'Login successful as Organizer',
        token,
        role: 'organizer',
        penyelenggara
      });

      res.redirect(`/penyelenggara/home?penyelenggara=${penyelenggara.penyelenggara_id}`)

      
    }
    else {
          // Validasi password untuk Users
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Email dan Password Salah' });
        }

        // Generate JWT untuk Users
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        console.log({
          message: 'Login successful as User',
          token,
          role: 'user',
          user: {
            id: user.user_id,
            nama: user.nama,
            email: user.email,
            role: user.role,
          },
        })

        res.redirect(`/mahasiswa/home?user=${user.user_id}`);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token');
    // res.json({ message: 'Logout successful' });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error during logout' });
  }
};

exports.changePassword = async (req, res) => {
  const { email, nama, newPassword, confirm_password } = req.body;

  try {
    // Cek user berdasarkan email dan nama
    let user = await Users.findOne({ where: { email, nama } });

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan dengan email dan nama yang diberikan' });
    }

    // Validasi password lama
    // const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ error: 'Password lama tidak sesuai' });
    // }

    if (!(newPassword == confirm_password)) {
      return res.status(401).json({ error: 'Konfirmasi Password tidak sesuai' });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password di tabel Users
    user.password = hashedPassword;
    await user.save();

    // res.json({ message: 'Password berhasil diubah untuk User' });

    console.log({ message: 'Password berhasil diubah untuk User' });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};
>>>>>>> d7b9900b4c768a9d19a88b341d7c2c6e277887f3
