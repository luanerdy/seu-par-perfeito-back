import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import connection from './database.js';

const app = express();
app.use(express.json());
app.use(cors());



export default app;