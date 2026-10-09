import { Request, Response } from 'express';
import { pool } from '../conf/dbConnection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE active = TRUE');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error interno de la base de datos' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id as string, 10);
    
    if (isNaN(idNum) || idNum <= 0) {
      res.status(400).json({ message: 'El ID debe ser un entero positivo' });
      return;
    }

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ? AND active = TRUE', [idNum]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Producto no encontrado o inactivo' });
      return;
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error interno de la base de datos' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, stock, description, brand, img } = req.body;

    if (!name || price === undefined || stock === undefined || !description) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      res.status(400).json({ message: 'El precio debe ser un número mayor a cero' });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO products (name, price, stock, description, brand, img) VALUES (?, ?, ?, ?, ?, ?)',
      [name, priceNum, stock, description, brand || null, img || null]
    );

    res.status(201).json({ message: 'Producto creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error interno de la base de datos' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id as string, 10);
    
    if (isNaN(idNum) || idNum <= 0) {
      res.status(400).json({ message: 'El ID debe ser un entero positivo' });
      return;
    }

    const { name, price, stock, description, brand, img } = req.body;
    const priceNum = parseFloat(price);
    
    if (isNaN(priceNum) || priceNum <= 0) {
      res.status(400).json({ message: 'El precio debe ser un número mayor a cero' });
      return;
    }

    const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM products WHERE id = ? AND active = TRUE', [idNum]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Producto no encontrado o inactivo' });
      return;
    }

    await pool.query<ResultSetHeader>(
      'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ?',
      [name, priceNum, stock, description, brand || null, img || null, idNum]
    );

    res.status(200).json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno de la base de datos' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id as string, 10);
    
    if (isNaN(idNum) || idNum <= 0) {
      res.status(400).json({ message: 'El ID debe ser un entero positivo' });
      return;
    }

    const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM products WHERE id = ? AND active = TRUE', [idNum]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Producto no encontrado o inactivo' });
      return;
    }

    await pool.query<ResultSetHeader>('UPDATE products SET active = FALSE WHERE id = ?', [idNum]);
    res.status(200).json({ message: 'Baja lógica aplicada al producto' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno de la base de datos' });
  }
};

export const changePrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id as string, 10);
    
    if (isNaN(idNum) || idNum <= 0) {
      res.status(400).json({ message: 'El ID debe ser un entero positivo' });
      return;
    }

    const { price } = req.body;
    const priceNum = parseFloat(price);
    
    if (price === undefined || isNaN(priceNum) || priceNum <= 0) {
      res.status(400).json({ message: 'El precio debe ser un número mayor a cero' });
      return;
    }

    const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM products WHERE id = ? AND active = TRUE', [idNum]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Producto no encontrado o inactivo' });
      return;
    }

    await pool.query<ResultSetHeader>('UPDATE products SET price = ? WHERE id = ?', [priceNum, idNum]);
    res.status(200).json({ message: 'Precio actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno de la base de datos' });
  }
};