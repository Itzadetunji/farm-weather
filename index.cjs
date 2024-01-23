const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./user.schema.cjs");
const app = express();

mongoose.connect(
	"mongodb+srv://itzadetunji:adetunjimay29@quotescluster.nxy3zov.mongodb.net/farm-weather?retryWrites=true&w=majority"
);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.get("/register-successful", (req, res) => {
	res.render("register-successful");
});

app.post("/register", async (req, res) => {
	try {
		let user = await User.findOne({ email: req.body.email });
		if (user) {
			return res.status(403).json({
				message:
					"This email is already registered to an account, kindly Login.",
			});
		} else {
			const newUser = new User(req.body);

			await newUser.save();

			return res.status(200).json({
				message: "User registration successful",
			});
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Failed to create the new user",
		});
	}
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", async (req, res) => {
	try {
		let user = await User.findOne({
			email: req.body.email,
			password: req.body.password,
		});

		console.log(user);
		if (user)
			return res.status(200).json({
				email: user.email,
				latitude: user.latitude,
				longitude: user.longitude,
				name: user.name,
			});

		return res.status(403).json({
			message: "Unable to find user",
		});
	} catch (error) {
		return res.status(403).json({
			message: "Failed to login user",
		});
	}
});

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/location", async (req, res) => {
	const { longitude, latitude } = req.body;
	try {
		const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=5d13922d646c92e4b5896d35e4c0e80d&units=metric`;
		const response = await fetch(url);
		let data = await response.json();
		res.status(200).json({ data: data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error });
	}
});

app.post("/city", async (req, res) => {
	const { city } = req.body;
	try {
		const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=5d13922d646c92e4b5896d35e4c0e80d&units=metric`;
		const response = await fetch(url);
		let data = await response.json();
		res.status(200).json({ data: data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error });
	}
});
