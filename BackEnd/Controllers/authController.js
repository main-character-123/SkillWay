const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../utils/email');
const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      role: user.role,
      image: user.image,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};



exports.addUser = async (req, res) => {
  try {
    const { name, email, password, age, country, gender } = req.body;

    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email || !validator.isEmail(email)) return res.status(400).json({ error: 'A valid email is required' });
    if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    if (!age || isNaN(parseInt(age, 10)) || parseInt(age, 10) <= 0) return res.status(400).json({ error: 'A valid age is required' });
    if (!country?.trim()) return res.status(400).json({ error: 'Country is required' });
    if (!gender?.trim()) return res.status(400).json({ error: 'Gender is required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: `The email ${email} is already registered.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      age: parseInt(age, 10),
      country: country.trim(),
      gender: gender.trim()
    });

    await newUser.save();
    signToken(newUser);
    res.status(201).json({
      message: 'User registered successfully.',
      AcessToken: signToken(newUser),
      user: {
        newUser
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: `The email is already registered.` });
    }

    console.error(`Error during user registration: ${error}`);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send('Email and password are required');
    }



    const user = await User.findOne({ email }).select(
      '+password',
    );
    if (!user) {
      console.log('User not found for email:', email);
      return res
        .status(401)
        .send('Invalid email or password');
    }


    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res
        .status(401)
        .send('Invalid email or password');
    }

    const token = signToken(user);
    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

