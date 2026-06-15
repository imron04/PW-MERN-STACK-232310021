const db = require("../models");
const User = db.User;

// 1. GET /api/users (Mengambil daftar semua user)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil semua data user",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });
    }
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil detail user",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, is_active } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, dan password wajib diisi",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      is_active: is_active ?? 1, // Jika tidak diisi, default ke 1 (aktif)
    });

    res.status(201).json({
      success: true,
      message: "User berhasil ditambahkan",
      data: newUser,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ success: false, message: "Email sudah terdaftar" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });
    }

    const { name, email, password, is_active } = req.body;

    await user.update({
      name: name || user.name,
      email: email || user.email,
      password: password || user.password,
      is_active: is_active !== undefined ? is_active : user.is_active,
    });

    res.status(200).json({
      success: true,
      message: "Data user berhasil diperbarui",
      data: user,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Email sudah digunakan oleh user lain",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });
    }

    await user.destroy();
    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
