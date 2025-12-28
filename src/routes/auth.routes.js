const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup/request-otp', authController.requestSignupOtp);
router.post('/signup/verify', authController.verifySignupOtp);
router.post('/login', authController.requestLoginOtp);
router.post('/login/verify', authController.verifyLoginOtp);

module.exports = router;
