import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';

beforeEach(async () => {
    await connection.query('DELETE FROM product_cart');
});

afterAll(async () => {
    await connection.query('DELETE FROM product_cart');
    connection.end();
});

describe("POST /cart", () => {
    const body = { userId: 1, productId: 1, quantity: 1 };
    it("returns status 400 for invalid body", async () => {
        const wrongBody = { ...body, quantity: 0 };
        const result = await supertest(app).post("/cart").send(wrongBody);
        expect(result.status).toEqual(400);
    });
    it("returns status 401 for invalid token", async () => {
        expect(0).toEqual(401);
    });
    it("returns status 201 and insert product on cart", async () => {
        const { userId, productId } = body;
        const result = await supertest(app).post("/cart").send(body);
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
        const result = await supertest(app).post("/cart").send(body);
        expect(result.status).toEqual(200);
        const product = await connection.query(`
            SELECT * FROM product_cart
            WHERE "userId" = $1 AND "productId" = $2
        `, [userId, productId]);
        expect(product.rows.length).toEqual(1);
        expect(product.rows[0].quantity).toEqual(2);
    });
});
/*
describe("GET /cart", () => {
    it("", async () => {

    });
});*/