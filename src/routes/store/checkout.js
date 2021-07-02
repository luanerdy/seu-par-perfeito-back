const checkout = (app, connection) => {
	app.post('/checkout', async (req, res) => {
		const { userId } = req.body;

		if (!userId) return res.sendStatus(400);

		try {
			await connection.query(`DELETE FROM product_cart WHERE "userId" = $1`, [
				userId,
			]);
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	});
};

export default checkout;
