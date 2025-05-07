const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});

async function seedDB() {
  try {
    const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
    const sales = JSON.parse(fs.readFileSync('./data/sales.json', 'utf-8'));

    await pool.query('DELETE FROM sales');
    await pool.query('DELETE FROM products');

    for (const product of products) {
      await pool.query(
        'INSERT INTO products (id, name, category) VALUES ($1, $2, $3)',
        [product.id, product.name, product.category]
      );
    }

    for (const sale of sales) {
      await pool.query(
        'INSERT INTO sales (id, product_id, quantity, date) VALUES ($1, $2, $3, $4)',
        [sale.id, sale.product_id, sale.quantity, sale.date]
      );
    }

    console.log('Database seeded successfully!');
    pool.end();
  } catch (err) {
    console.error('Error seeding database:', err);
    pool.end();
  }
}

seedDB();
