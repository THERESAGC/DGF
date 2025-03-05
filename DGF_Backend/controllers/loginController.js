// loginController.js
const loginService = require('../services/loginService');

const getLoginDetails = async (req, res) => {
  try {
    const loginDetails = await loginService.getLoginDetails();
    res.status(200).json(loginDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving login details' });
  }
};

module.exports = {
  getLoginDetails,
};
