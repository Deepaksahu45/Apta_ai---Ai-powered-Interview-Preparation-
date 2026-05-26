const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/login', authController.loginUser);

/**
 * @route POST /api/auth/logout
 * @desc Clear cookies from the user and add the token to blacklist
 * @access Public
 */

authRouter.get('/logout', authController.logoutUser);

/**
 * @route GET /api/auth/get-me
 * @desc Get the current user's information
 * @access private
 */


authRouter.get('/get-me', authMiddleware.authUser, authController.getmecontroller);

module.exports = authRouter;
