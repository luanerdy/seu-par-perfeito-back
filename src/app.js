import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import connection from './database.js';
import { routes } from './routes/routes.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/products', async (req, res) => {
	try {
		const request = await connection.query('SELECT * FROM products');
		const products = request.rows;
		if (request.rows.length === 0) return res.sendStatus(404);
		res.send(products);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

routes(app);

export default app;
