const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./user.schema");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/weather");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", async (req, res) => {
	try {
		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res.status(403).json({
				message:
					"This email is already registered to an account, kindly Login.",
			});
		const newUser = new User(req.body);
		console.log(req.body);
		newUser.save();

		res.render("register-successful");
	} catch (error) {
		throw new Error("Failed to create the new user");
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

		if (user)
			return res.status(200).json({
				email: user.email,
				name: user.name,
				latitude: user.latitude,
				longitude: user.longitude,
			});
		return res.status(403).json({
			message: "Unable to find user",
		});
	} catch (error) {
		throw new Error("Failed to login user");
	}
});
