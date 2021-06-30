import { userSchema } from '../../utils/schemas.js';
import bcrypt from 'bcrypt';

const signup = (app, connection) => {
	app.post('/auth/signup', async (req, res) => {
		const { name, email, password } = req.body;

		const sql = `
                    INSERT INTO users 
                    (name, email, password) 
                    VALUES ($1, $2, $3)`;

		if ('error' in userSchema.validate(req.body)) {
			return res.sendStatus(400);
		}
        
        const hash = bcrypt.hashSync(password, 10);

		try {
			const existsUser = await connection.query(
				`SELECT * FROM users WHERE email = $1`,
				[email]
			);

			if (existsUser.rows.length !== 0) {
				return res.sendStatus(409);
			}

			await connection.query(sql, [name, email, hash]);
			res.sendStatus(201);
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	});
};

export { signup };
