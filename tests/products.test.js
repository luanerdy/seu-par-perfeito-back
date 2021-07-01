import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';

beforeEach(async () => {
    await connection.query('DELETE FROM products');
});

afterAll(async () => {
    await connection.query('DELETE FROM products');
    await connection.query(`
                INSERT INTO products (name, value, description, image) VALUES
                ('AllStar vermelho', 15000, 'AllStart vermelho bonitão pra por no pé', 'https://static.rockcity.com.br/public/rockcity/imagens/produtos/d67129fb546c9e5ef21c53c0be157cbf.jpg'),
                ('AllStar azul', 15000, 'AllStart azul bonitão pra por no pé', 'https://espacotenis.vteximg.com.br/arquivos/ids/162844-1000-1000/Converse-Chuck-Taylor-All-Star-Azul-Nautico--Preto-Branco.jpg?v=637402756547870000')
            `);
    connection.end();
});

describe("POST /products", () => {
    const body = { 
        name: 'sapato teste', 
        value: '999', 
        description: 'teste', 
        image: 'https://http.cat/204' 
    };

    it("returns status 400 for missing/wrong parameters", async () => {
        const wrongBody = { ...body, value: '' };
        const result = await supertest(app).post("/products").send(wrongBody);
        expect(result.status).toEqual(400);
    });

    it("returns status 201 and insert product for right parameters", async () => {
        const post = await supertest(app).post("/products").send(body);
        expect(post.status).toEqual(201);
        const result = await connection.query('SELECT * FROM products');
        const products = result.rows;
        expect(products.length).toEqual(1);
    });
});

describe("GET /products", () => {
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