const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// Helper function to get default dates (last 7 days)
function getDefaultDates() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 6);
  
  return {
    start: weekAgo.toISOString().split('T')[0],
    end: today.toISOString().split('T')[0]
  };
}

// Helper to validate dates
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

// GET daily sales (optionally with date filter)
router.get('/daily', async (req, res) => {
  try {
    let { start, end } = req.query;
    
    // Use default dates if not provided or invalid
    if (!start || !end || !isValidDate(start) || !isValidDate(end)) {
      const defaults = getDefaultDates();
      start = start && isValidDate(start) ? start : defaults.start;
      end = end && isValidDate(end) ? end : defaults.end;
    }
    
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
    console.error('Error in /daily endpoint:', err);
    res.status(500).json({
      error: 'Error fetching daily sales',
      message: err.message
    });
  }
});

// GET top 5 products by quantity sold (with optional date filter)
router.get('/top-products', async (req, res) => {
  try {
    let { start, end } = req.query;
    
    // Use default dates if not provided or invalid
    if (!start || !end || !isValidDate(start) || !isValidDate(end)) {
      const defaults = getDefaultDates();
      start = start && isValidDate(start) ? start : defaults.start;
      end = end && isValidDate(end) ? end : defaults.end;
    }

    const result = await pool.query(
      `SELECT p.name, p.category, SUM(s.quantity) AS total_sold
       FROM sales s
       JOIN products p ON s.product_id = p.id
       WHERE s.date BETWEEN $1 AND $2
       GROUP BY p.name, p.category
       ORDER BY total_sold DESC
       LIMIT 5`,
      [start, end]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error in /top-products endpoint:', err);
    res.status(500).json({
      error: 'Error fetching top products',
      message: err.message
    });
  }
});

module.exports = router;
