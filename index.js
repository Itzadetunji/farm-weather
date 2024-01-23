const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./user.schema");
const app = express();

mongoose.connect("mongodb+srv://SOLD:XUn0GZ81rl98NLF5@cluster0.vrb1nxs.mongodb.net/?retryWrites=true&w=majority");

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
        message: "Logged in successfully",
      });
    return res.status(403).json({
      message: "Unable to find user",
    });
  } catch (error) {
    throw new Error("Failed to login user");
  }
});
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/", async (req, res) => {
  const { longitude, latitude } = req.body;
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=5d13922d646c92e4b5896d35e4c0e80d`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});
