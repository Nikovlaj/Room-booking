const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    //Kolla om användarnamn och lösenord finns
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Användarnamn och lösenord krävs" });
    }
    //kolla om användaren redan finns
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Användarnamnet är redan taget" });
    }
    //hasha lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role: "User",
    });

    await user.save();
    res.status(201).json({ message: "Användare registrerad" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Något gick fel" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Inloggingsförsök", username);

    //kontrollera inmatning
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Användarnamn och lösenord krävs" });
    }
    //Hitta användare i databasen
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Felaktigt Användarnamn eller lösenord" });
    }
    //Jämför Lösenord
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Felaktigt Användarnamn eller lösenord" });
    }
    //JWT token
    const token = jwt.sign(
      { userid: user._id, role: user.role },
      process.env.JWT_secret,
      { expiresIn: "5h" }
    );
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Fel i authcontroller:", err);
    res.status(500).json({ message: "Något gick fel" });
  }
};
