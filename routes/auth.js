const express = require('express');
const { signUpUser, loginUser } = require('../controllers/auth_controller');
const router = express.Router();


router.post('/signup', signUpUser);
// login route 
router.post('/login',loginUser); 

module.exports = router;