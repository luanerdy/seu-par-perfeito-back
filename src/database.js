import pg from 'pg';

const { Pool } = pg;
const connection = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'seu_par_perfeito_store',
    password: '123456',
    port: 5432
});

export default connection;