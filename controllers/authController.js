const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const Penyelenggara = require('../models/Penyelenggara'); 

exports.register = async (req, res) => {
  const { nama, nim, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const users = await Users.create({
      nama,
      nim,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully', users });
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
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT untuk Penyelenggara
      const token = jwt.sign(
        { penyelenggaraId: penyelenggara.penyelenggara_id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({
        message: 'Login successful as Organizer',
        token,
        role: 'organizer',
        penyelenggara: {
          id: penyelenggara.penyelenggara_id,
          nama: penyelenggara.nama_penyelenggara,
          email: penyelenggara.email,
          jenis: penyelenggara.jenis,
        },
      });
    }

    // Validasi password untuk Users
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT untuk Users
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      message: 'Login successful as User',
      token,
      role: 'user',
      user: {
        id: user.user_id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error occurred' });
  }
};