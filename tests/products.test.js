import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';

afterAll(async () => {
    connection.end();
});

describe("GET /products", () => {
    beforeEach(async () => {
        await connection.query('DELETE FROM products');
    });

    it("returns 404 if the array is empty", async () => {
        const result = await supertest(app).get("/products");
        expect(result.status).toEqual(404);
    });
    
    it("returns an array of products", async () => {
        await connection.query(`
                INSERT INTO products (name, value, description, image) VALUES
                ('AllStar vermelho', 15000, 'AllStart vermelho bonitão pra por no pé', 'https://static.rockcity.com.br/public/rockcity/imagens/produtos/d67129fb546c9e5ef21c53c0be157cbf.jpg'),
                ('AllStar azul', 15000, 'AllStart azul bonitão pra por no pé', 'https://espacotenis.vteximg.com.br/arquivos/ids/162844-1000-1000/Converse-Chuck-Taylor-All-Star-Azul-Nautico--Preto-Branco.jpg?v=637402756547870000')
            `);
        const result = await supertest(app).get("/products");
        expect(result.body.length).toEqual(2);
    });
});