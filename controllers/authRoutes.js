const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log(req.body);

    if (!email.includes("@gmail.com")) {
      return res
        .status(400)
        .json({ msg: "Please enter valid email !", status: false });
    }
    //check that is there a same username exits
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res
        .status(401)
        .json({ msg: "Username already used !", status: false });
    }

    //check that is there a same email exists
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res
        .status(400)
        .json({ msg: "Email is already registered!", status: false });
    }

    //create hashed pass
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //adding user details in database
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const userDetails = {
      username: user.username,
      email,
    };

    const secretKey = "ABC";

    const payload = {
      userDetails,
    };

    const jwtToken = await jwt.sign(payload, secretKey);

    return res.status(201).json({ status: true, jwtToken });
  } catch (error) {
    return res.status(500).json({ msg: "Server issue", status: false });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email.includes("@gmail.com")) {
      return res
        .status(400)
        .json({ msg: "Please enter valid email !", status: false });
    }

    //authentication for user
    const user = await User.findOne({ email });
    console.log(user);
    if (!user)
      return res
        .status(401)
        .json({ msg: "Email is not registered!", status: false });

    //check whethere user entered password is same as the password which is in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ msg: "Incorrect Password :(", status: false });

    const userDetails = {
      username: user.username,
      email,
    };

    const secretKey = "SSC";

    //user details can be sent through payload in form of jwttoken
    const payload = {
      userDetails,
    };
    const jwtToken = await jwt.sign(payload, secretKey);

    return res.status(200).json({ status: true, jwtToken });
  } catch (error) {
    return res.status(500).json({ msg: "Server issue :(", status: false });
  }
};