const database = require("../database/");

module.exports = app => {
	app.get("/calendar", async (req, res) => {
		const {user, password} = req.query;
		res.send(await database.getCalendar(user, password));
	});

	app.post("/signup", async (req, res) => {
		const {user, password} = req.body;
		res.send(await database.signupUser(user, password));
	});

	app.post("/event", async (req, res) => {
		const {user, password, event} = req.body;
		res.send(await database.addEvent(user, password, event));
	});

	app.delete("/event", async (req, res) => {
		const {user, password, event} = req.body;
		res.send(await database.deleteEvent(user, password, event));
	});
};