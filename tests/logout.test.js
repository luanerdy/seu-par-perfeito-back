import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';

afterAll(async () => {
	connection.end();
});

beforeEach(async () => {
	await connection.query('DELETE FROM sessions');
});

describe('POST /auth/login', () => {
	it('returns 400 for empty token', async () => {
		const result = await supertest(app).post('/auth/logout');
		const status = result.status;

		expect(status).toEqual(400);
	});

	it('returns 200 for existing token', async () => {
		const token = 'any_token';

		const result = await supertest(app)
			.post('/auth/logout')
			.set({ Authorization: `Bearer ${token}` });
		const status = result.status;

		expect(status).toEqual(200);
	});

	it('deletes a session for valid token', async () => {
		const [userId, token] = [
			98,
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTHVhbiIsImlhdCI6MTYyNTE3MDk2M30.REcGv6MQn_58Nf5bNdgSshnqrb8KwDojruo-zQ0fMzc',
		];

		await connection.query(
			`INSERT INTO sessions ("userId", token) values ($1, $2)`,
			[userId, token]
		);

		const beforeLogout = await connection.query(`SELECT * FROM sessions`);

		const result = await supertest(app)
			.post('/auth/logout')
			.set({ Authorization: `Bearer ${token}` });

		const afterLogout = await connection.query(`SELECT * FROM sessions`);
		const status = result.status;

		expect(status).toEqual(200);
		expect(beforeLogout.rowCount - afterLogout.rowCount).toEqual(1);
	});
});
