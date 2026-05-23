const db = require('../services/mysql.service');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM product');
    res.json(rows);
  } catch (err) {
    console.error('Error obteniendo productos:', err);
    res.status(500).json({ error: 'Error interno al obtener productos' });
  }
};



const getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM product WHERE id_product = ?',
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('Error obteniendo producto por id:', err);
    res.status(500).json({ error: 'Error interno al obtener producto' });
  }
};


const create = async (req, res) => {
  try {
    const { name, price } = req.body;

    const [result] = await db.query(
      'INSERT INTO product (name, price) VALUES (?, ?)',
      [name, price]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Error creando producto:', err);
    res.status(500).json({ error: 'Error interno al crear producto' });
  }
};



const update = async (req, res) => {
  try {
    const { name, price } = req.body;

    await db.query(
      'UPDATE product SET name=?, price=? WHERE id_product=?',
      [name, price, req.params.id]
    );

    res.json({ mensaje: 'Actualizado' });
  } catch (err) {
    console.error('Error actualizando producto:', err);
    res.status(500).json({ error: 'Error interno al actualizar producto' });
  }
};




const remove = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM product WHERE id_product=?',
      [req.params.id]
    );

    res.json({ mensaje: 'Eliminado' });
  } catch (err) {
    console.error('Error eliminando producto:', err);
    res.status(500).json({ error: 'Error interno al eliminar producto' });
  }
};

module.exports = { getAll, getById, create, update, remove };
