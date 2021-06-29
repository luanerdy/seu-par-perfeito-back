import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import connection from './database.js';
import productSchema from './schemas/productSchema.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post("/products", async (req, res) => {
    try {
        const { name, value, description, image } = req.body;
        const validation = productSchema.validate({ name, value, description, image });
        if (validation.error) return res.sendStatus(400);
        await connection.query(`
            INSERT INTO products
            (name, value, description, image)
            VALUES ($1,$2,$3,$4)
        `, [ name, value, description, image ]);
        res.sendStatus(201);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get("/products", async (req, res) => {
    try {
        const request = await connection.query('SELECT * FROM products');
        const products = request.rows;
        if (request.rows.length === 0) return res.sendStatus(404);
        res.send(products);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

export default app;