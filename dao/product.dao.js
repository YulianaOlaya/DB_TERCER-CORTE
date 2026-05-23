const db = require('../services/mysql.service');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM product');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM product WHERE id_product = ?',
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, price } = req.body;

    const [existing] = await db.query(
      'SELECT id_product FROM product WHERE name = ? LIMIT 1',
      [name]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Producto ya existe' });
    }

    const [result] = await db.query(
      'INSERT INTO product (name, price) VALUES (?, ?)',
      [name, price]
    );

    res.json({ id: result.insertId });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { name, price } = req.body;

    await db.query(
      'UPDATE product SET name=?, price=? WHERE id_product=?',
      [name, price, req.params.id]
    );

    res.json({ mensaje: "Actualizado" });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM product WHERE id_product=?',
      [req.params.id]
    );

    res.json({ mensaje: "Eliminado" });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
