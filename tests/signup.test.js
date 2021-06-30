import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';

afterAll(async () => {
	connection.end();
});

beforeEach(async () => {
	await connection.query('DELETE FROM users');
});

describe('POST /auth/signup', () => {
	it('returns 400 for empty body', async () => {
		const user = {};

		const result = await supertest(app).post('/auth/signup').send(user);
		const status = result.status;

		expect(status).toEqual(400);
	});

	it('return 400 for invalid params', async () => {
		const user = {
			name: 'Luan',
			email: 'luanv',
			password: 'My1stPassword',
		};

		const result = await supertest(app).post('/auth/signup').send(user);
		const status = result.status;

		expect(status).toEqual(400);
	});

	it('returns 409 for existing user email', async () => {
		const user = {
			name: 'Luan',
			email: 'luan.vini1@gmail.com',
			password: 'My1stPassword',
		};

		await supertest(app).post('/auth/signup').send(user);

		const result = await supertest(app).post('/auth/signup').send(user);
		const status = result.status;

		expect(status).toEqual(409);
	});

	it('returns 201 for valid params', async () => {
		const user = {
			name: 'Luan',
			email: 'luan.vini1@gmail.com',
			password: 'My1stPassword',
		};

		const result = await supertest(app).post('/auth/signup').send(user);
		const status = result.status;

		expect(status).toEqual(201);
	});
});
