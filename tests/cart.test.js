import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';

const fakeUserId = 1;
const fakeToken = "123456";

beforeAll(async () => {
    await connection.query('INSERT INTO sessions ("userId", token) values ($1,$2)'
    , [fakeUserId, fakeToken]);
});

beforeEach(async () => {
    await connection.query('DELETE FROM product_cart');
});

afterAll(async () => {
    await connection.query('DELETE FROM product_cart');
    await connection.query('DELETE FROM sessions');
    connection.end();
});

describe("POST /cart", () => {
    const body = { userId: fakeUserId, productId: 1, quantity: 1 };
    it("returns status 406 for invalid body", async () => {
        const wrongBody = { ...body, quantity: 0 };
        const result = await supertest(app).post("/cart").send(wrongBody).set('Authorization', `Bearer ${fakeToken}`);
        expect(result.status).toEqual(406);
    });
    it("returns status 400 for missing token", async () => {
        const result = await supertest(app).post("/cart").send(body);
        expect(result.status).toEqual(400);
    });
    it("returns status 401 for invalid token", async () => {
        const result = await supertest(app).post("/cart").send(body).set('Authorization', 'Bearer 1234567890');
        expect(result.status).toEqual(401);
    });
    it("returns status 201 and insert product on cart", async () => {
        const { userId, productId } = body;
        const result = await supertest(app).post("/cart").send(body).set('Authorization', `Bearer ${fakeToken}`);
        expect(result.status).toEqual(201);
        const product = await connection.query(`
            SELECT * FROM product_cart
            WHERE "userId" = $1 AND "productId" = $2
        `, [userId, productId]);
        expect(product.rows.length).toEqual(1);
    });
    it("returns status 200 and update quantity for product already on cart", async () => {
        const { userId, productId, quantity } = body;
        await connection.query(`
            INSERT INTO product_cart
            ("userId", "productId", quantity)
            VALUES ($1, $2, $3)
        `, [userId, productId, quantity]);
        const result = await supertest(app).post("/cart").send(body).set('Authorization', `Bearer ${fakeToken}`);
        expect(result.status).toEqual(200);
        const product = await connection.query(`
            SELECT * FROM product_cart
            WHERE "userId" = $1 AND "productId" = $2
        `, [userId, productId]);
        expect(product.rows.length).toEqual(1);
        expect(product.rows[0].quantity).toEqual(quantity*2);
    });
});
/*
describe("GET /cart", () => {
    it("", async () => {

    });
});*/