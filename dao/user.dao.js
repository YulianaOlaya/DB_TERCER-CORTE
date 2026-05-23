const db = require('../services/mysql.service');

const create = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const sql = 'INSERT INTO `user` (name, email, password) VALUES (?, ?, ?)';
    const values = [name, email, password];

    const [result] = await db.query(sql, values);
    res.status(201).json({ id: result.insertId });
    
  } catch (err) {
    console.error('Error detallado en el DAO:', err);
    res.status(500).json({ error: "Error interno al registrar usuario" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const [rows] = await db.query(
      'SELECT * FROM `user` WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no existente" });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      id: user.id_user || user.id || null,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error('Error login usuario:', err);
    res.status(500).json({ error: "Error interno al iniciar sesión" });
  }
};

module.exports = { create, login };