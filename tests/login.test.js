import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';
import bcrypt from 'bcrypt';

afterAll(async () => {
	connection.end();
});

beforeEach(async () => {
	await connection.query('DELETE FROM sessions');
});

describe('POST /auth/login', () => {
	it('returns 400 for empty body', async () => {
		const data = {};

		const result = await supertest(app).post('/auth/login').send(data);
		const status = result.status;

		expect(status).toEqual(400);
	});

	it('returns 400 for invalid email', async () => {
		const body = {
			name: 'Luan',
			email: 'luanv@luanv.com',
			password: 'My1stPassword',
        };

        const { name, email, password } = body;

		const hash = bcrypt.hashSync(password, 10);

		await connection.query(
			`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
			[name, email, hash]
		);

		const data = {
			email: 'luanv@error.com',
			password: 'My1stPassword',
		};

		const result = await supertest(app).post('/auth/login').send(data);
		const status = result.status;

		expect(status).toEqual(400);
	});

	it('returns 400 for invalid password', async () => {
		const body = {
			name: 'Luan',
			email: 'luanv@luanv.com',
			password: 'My1stPassword',
        };

        const { name, email, password } = body;

		await connection.query(
			`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
			[name, email, password]
		);

		const data = {
			email: 'luanv@luanv.com',
			password: 'error',
		};

		const result = await supertest(app).post('/auth/login').send(data);
		const status = result.status;

		expect(status).toEqual(400);
	});

	it('returns user data for valid params', async () => {
		const body = {
			name: 'Luan',
			email: 'luanv@luanv.com',
			password: 'My1stPassword',
        };

        const { name, email, password } = body;

		await connection.query(
			`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
			[name, email, password]
		);

		const data = {
			email: 'luanv@luanv.com',
			password: 'My1stPassword',
		};

		const result = await supertest(app).post('/auth/login').send(data);
		const [status, user] = [result.status, result.body];

		expect(status).toEqual(200);
		expect(user.name).toEqual('Luan');
	});
});
