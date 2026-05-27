const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklist.model');

/**
 * @name registerUser
 * @desc Register a new user
 * @access Public
 */

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email, and password are required',
      });
    }

    // check existing user
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Account with this email or username already exists',
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);

    return res.status(500).json({
      message: 'Error registering user',
    });
  }
};

/**
 * @name loginUser
 * @desc Login user
 * @access Public
 */

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // find user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);

    return res.status(500).json({
      message: 'Error logging in user',
    });
  }
};

/**
 * @name logoutUser
 * @desc Logout user
 * @access Public
 */

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) {
      await blacklistModel.create({ token });
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.status(200).json({
      message: 'User logged out successfully',
    });
  } catch (error) {
    console.error('Logout Error:', error);

    return res.status(500).json({
      message: 'Error logging out user',
    });
  }
};

/**
 * @name getmecontroller
 * @desc Get current user
 * @access Private
 */

const getmecontroller = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Get Me Error:', error);

    return res.status(500).json({
      message: 'Error getting user information',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getmecontroller,
};
