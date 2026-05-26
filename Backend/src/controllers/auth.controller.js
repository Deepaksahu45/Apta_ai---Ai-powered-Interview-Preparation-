const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklist.model');

/**
 * @name registerUser
 * @desc Register a new user , expects username, email, and password in the request body
 * @access Public
 */

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validate the input
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Username, email, and password are required' });
    }

    // existing user check
    const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Account with this email or username already exists' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const user = await userModel.create({ username, email, password: hashedPassword });

    // generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

/**
 * @name loginUser
 * @desc Login a user, expects email and password in the request body
 * @access Public
 */

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // validate the input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // existing user check
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      message: 'User logged in successfully',
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in user' });
  }
};

/**
 * @name logoutUser
 * @desc Clear cookies from the user and add the token to blacklist
 * @access Public
 */

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) {
      await blacklistModel.create({ token });
    }

    res.clearCookie('token');

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging out user' });
  }
};

/**
 * @name getmecontroller
 * @desc Get the current user's information
 * @access private
 */

const getmecontroller = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting user information' });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getmecontroller };
