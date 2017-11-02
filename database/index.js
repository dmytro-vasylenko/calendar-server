const MongoClient = require("mongodb").MongoClient;
const crypto = require("crypto");

const config = require("../config");

var db;

MongoClient.connect(config.mongodbUrl, (error, database) => {
	if(error) {
		return console.log("ERROR:", error);
	}
	db = database;
	console.log("Connected to MongoDB");

	db.collection("users").insert({
		user: "test",
		password: hashPassword("test"),
		calendar: []
	});
});


const hashPassword = password => crypto.createHmac("sha256", config.secret).update(password).digest("hex");

const getCalendar = async (user, password) => {
	let calendar = null;
	try {
		password = hashPassword(password);
		userDoc = await db.collection("users").findOne({user, password});
		return userDoc ? userDoc.calendar : "Invalid login or password";
	} catch(error) {
		console.log("ERROR:", error);
		return "ERROR";
	}
};

const signupUser = async (user, password) => {
	password = hashPassword(password);
	let response;
	try {
		let exists = await db.collection("users").findOne({user});
		if(exists) {
			return "User already exists";
		}
		response = await db.collection("users").insert({user, password, calendar: []});
		return "OK";
	} catch(error) {
		console.log("ERROR:", error);
		return "ERROR";
	}
};

const addEvent = async (user, password, event) => {
	try {
		password = hashPassword(password);
		let correctLogin = await db.collection("users").findOne({user, password});
		let correctEvent = event && Number.isInteger(+(event.start)) && Number.isInteger(+(event.duration)) && event.title;
		if(correctLogin && correctEvent) {
			await db.collection("users").update({user, password}, {
				$push: {
					calendar: event
				}
			});
			return "OK";
		} else {
			return "Invalid login, password or event";
		}
	} catch(error) {
		console.log("ERROR:", error);
		return "ERROR";
	}
};

const deleteEvent = async (user, password, event) => {
	try {
		password = hashPassword(password);
		const correctLogin = await db.collection("users").findOne({user, password});
		if(correctLogin) {
			db.collection("users").update({user, password}, {
				$pull: {
					calendar: {
						title: event.title,
						start: event.start.toString(),
						duration: event.duration.toString()
					}
				}
			});
			return "OK";
		} else {
			return "Invalid login or password";
		}
	} catch(error) {
		console.log("ERROR:", error);
		return "ERROR";
	}
};

module.exports = {getCalendar, signupUser, addEvent, deleteEvent};