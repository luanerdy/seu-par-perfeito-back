const logout = (app, connection) => {
    app.post('/auth/logout', async (req, res) => {
		const token = req.get('authorization')?.replace('Bearer ', '');

		const sql = `
                    DELETE FROM sessions
                    WHERE token = $1`;

		if (!token) {
			return res.sendStatus(400);
		}

		try {
			await connection.query(sql, [token]);
			res.sendStatus(200);
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	});
};

export {logout};
