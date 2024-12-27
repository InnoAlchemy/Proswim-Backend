const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Route to upload and process Excel file
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        // Read and parse the Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        // Skip header row and process data
        const rows = data.slice(1).map((row, index) => {
            try {
                return {
                    title: row[0]?.trim() || null,
                    barcode: String(row[1]).trim(),
                    stock: parseInt(row[2]?.replace(/\D/g, '')) || 0, // Extract numeric value from "pcs"
                    price_usd: parseFloat(row[4]?.replace(/[^\d.]/g, '')) || 0.0, // Extract numeric value from "$"
                };
            } catch (error) {
                console.error(`Error processing row ${index + 2}:`, row, error.message);
                return null; // Skip invalid rows
            }
        }).filter(Boolean); // Filter out invalid rows

        const connection = await pool.getConnection();

        try {
            for (const product of rows) {
                // Validate required fields
                if (!product.title || !product.barcode) {
                    console.error(`Invalid product data:`, product);
                    continue; // Skip invalid entries
                }

                // Check for duplicates
                const [existing] = await connection.execute(
                    'SELECT id FROM products WHERE title = ? OR barcode = ?',
                    [product.title, product.barcode]
                );

                if (existing.length > 0) {
                    console.log(`Skipping duplicate product: ${product.title} (${product.barcode})`);
                    continue;
                }

                // Insert new product
                await connection.execute(
                    'INSERT INTO products (title, barcode, stock, price_usd, created_at) VALUES (?, ?, ?, ?, NOW())',
                    [product.title, product.barcode, product.stock, product.price_usd]
                );

                console.log(`Inserted product: ${product.title}`);
            }

            res.status(200).json({ message: 'Products uploaded and processed successfully.' });
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error processing file:', err.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;