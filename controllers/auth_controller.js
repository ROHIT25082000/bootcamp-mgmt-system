/**
 * @author team bootcamp-41 2022
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const User = require('../models/user_model');


/**
 * AGE of the jwt Token 
 */
 const jwtAGE = 60 * 60 * 2

 /**
  * AGE of the cookie   
  */
 const cookieAGE = jwtAGE * 1000 
 
 /**
  *  function createJwtToken is used to create a JWT token
  *  @param : Takes in the _id for the user document  
  */ 
 
function createJwtToken(id, role) {
     return jwt.sign({
                         "UserInfo":{
                             "userId": id, 
                             "roles": role
                         }
                     }, process.env.JWT_SECRET, {expiresIn: jwtAGE});
}

/**
 *  
 * function signUpUser is used for sign up 
 * 
 * @param {request} req 
 * @param {respond} res 
 * @returns json
 */

const signUpUser = async (req, res) => {

    const emailExists = await User.findOne({email: req.body.email}); 
    if(emailExists) {
        return res.status(400).send(JSON.stringify({message: "emailExists"}));
    }

    const salt = await  bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(req.body.password, salt);  
    
    const current_user = {
        email: req.body.email,  
        password: hashedPassword,
        name: req.body.name,
        BU: req.body.BU, 
        role: req.body.role, 
        qualification: req.body.qualification
    }; 

    try {
        const newUser = await User.create(current_user);
        const token = createJwtToken(newUser._id, [newUser.role]);
        res.cookie('jwt', token, {httpOnly: false, maxAge: cookieAGE});

        const response = {
            email: newUser.email,
            name: newUser.name,
            BU: newUser.BU,
            role: newUser.role,
            qualification: newUser.qualification,
            team_id: newUser.team_id
        }; 

        res.status(200).json( {
            message: "success",
            newUserObject: response
        });   
    } catch(err) {
        res.status(400).json({
            message: err.message
        }); 
    }
}

/**
 * function loginUser is used to create users and 
 * return and set JWT for authentication  
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns json
 */

 const loginUser = async (req, res) => {

    const current_user = await User.findOne({email: req.body.email}); 
    if(!current_user) {
        return res.status(400).send(JSON.stringify({message: "emailNotFound"}));
    }
    const validPass = await bcrypt.compare(req.body.password, current_user.password); 

    if(!validPass) {
        return res.status(400).send(JSON.stringify({message: "invalidPassword"}));
    }
    const token = createJwtToken(current_user._id, [current_user.role]);
    res.cookie('jwt', token, {httpOnly: false, maxAge: cookieAGE}); 
    return res.status(200).send(JSON.stringify({message: "Auth Success", user: current_user}));
}

module.exports = {
    signUpUser,
    loginUser
};