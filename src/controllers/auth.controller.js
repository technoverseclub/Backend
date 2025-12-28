const authService = require('../services/auth.service');

exports.requestSignupOtp = async (req, res) => {
  try {
    await authService.requestSignupOtp(req.body);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifySignupOtp = async (req, res) => {
  try {
    const user = await authService.verifySignupOtp(req.body);
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.requestLoginOtp = async (req, res) => {
  try {
    await authService.requestLoginOtp(req.body);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.verifyLoginOtp = async (req, res) => {
  try {
    const data = await authService.verifyLoginOtp(req.body);
    res.json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
