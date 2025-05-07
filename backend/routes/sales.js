const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET daily sales (optionally with date filter)
router.get('/daily', async (req, res) => {
  try {
    const { start, end } = req.query;

    const result = await pool.query(
      `SELECT date, SUM(quantity) AS total_sales
       FROM sales
       WHERE date BETWEEN $1 AND $2
       GROUP BY date
       ORDER BY date`,
      [start, end]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching daily sales');
  }
});

// GET top 5 products by quantity sold
router.get('/top-products', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.name, SUM(s.quantity) AS total_sold
       FROM sales s
       JOIN products p ON s.product_id = p.id
       GROUP BY p.name
       ORDER BY total_sold DESC
       LIMIT 5`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching top products');
  }
});

module.exports = router;
