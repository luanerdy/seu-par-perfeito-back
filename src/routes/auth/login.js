import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = (app, connection) => {
	app.post('/auth/login', async (req, res) => {
		const { email, password } = req.body;

		const sql = `
                    INSERT INTO sessions 
                    ("userId", token) 
                    VALUES ($1, $2)`;

		if (!email || !password) {
			return res.sendStatus(400);
		}

		try {
			const existsUser = await connection.query(
				`SELECT * FROM users WHERE email = $1`,
				[email]
			);

			if (
				existsUser.rows.length === 0 ||
				!bcrypt.compareSync(password, existsUser.rows[0].password)
			) {
				return res.sendStatus(400);
			}

			const { id, name, email } = existsUser.rows[0];
            const token = jwt.sign({ name }, process.env.JWT_SECRET);

			await connection.query(sql, [id, token]);
			res.send({
				name,
				email,
				userId: id,
                token
			});
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	});
};

export { login };
