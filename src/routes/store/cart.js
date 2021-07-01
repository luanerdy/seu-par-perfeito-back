import cartSchema from '../../schemas/cartSchema.js';

const cart = (app, connection) => {
    app.post("/cart", async (req, res) => {
        try {
            const { userId, productId, quantity } = req.body;
            const validate = cartSchema.validate(req.body);
            if (validate.error) return res.sendStatus(406);

            const authorization = req.header('Authorization');
            const token = authorization?.replace('Bearer ', '');
            if(!token) return res.sendStatus(400);
            
            const tokenValidation = await connection.query(`
                SELECT * FROM sessions
                WHERE "userId" = $1 AND token = $2
            `, [userId, token]);
            if (tokenValidation.rows.length === 0) return res.sendStatus(401);
            
            const product = await connection.query(`
                SELECT * FROM product_cart
                WHERE "userId" = $1 AND "productId" = $2
            `, [userId, productId]);
            
            if (product.rows[0]) {
                await connection.query(`
                    UPDATE product_cart
                    SET quantity = quantity + $1
                    WHERE "userId" = $2 AND "productId" = $3
                `, [quantity, userId, productId]);
                res.sendStatus(200);
            } else {
                await connection.query(`
                    INSERT INTO product_cart
                    ("userId", "productId", quantity)
                    VALUES ($1, $2, $3)
                `, [userId, productId, quantity]);
                res.sendStatus(201);
            }
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        };
    });
    
    app.get("/cart", async (req, res) => {
        try {
            //check all product_cart for that user
            //const authorization = req.header('Authorization');
            //const token = authorization?.replace('Bearer ', '');
            //if(!token) return res.sendStatus(401);
            const { userId } = req.body;
            const products = await connection.query(`
                SELECT * FROM product_cart
                WHERE 
            `);
            //return list of products on that cart
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
};

export default cart