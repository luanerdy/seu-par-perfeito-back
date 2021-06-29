import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import connection from './database.js';

const app = express();
app.use(express.json());
app.use(cors());

//sign-up

//sign-in

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

app.post("/cart", async (req, res) => {
    //check if this user already has this product
        //if there is, UPDATES 1 in quatity
        //if there isn't INSERT
});

app.get("/cart", async (req, res) => {
    //check all product_cart for that user
    //return list of products on that cart
});

export default app;