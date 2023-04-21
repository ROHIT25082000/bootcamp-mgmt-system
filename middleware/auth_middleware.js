const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
/**
 * This function is used to make sure we are Authenticated Users across 
 * the website 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt; 
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);  
                res.redirect('/login');
            } else {
                req.user = decodedToken.UserInfo.userId;
                req.roles = decodedToken.UserInfo.roles; 
                console.log(decodedToken); 
                next();
            }
        }); 
    } else {
       res.status(400).json({
            message: "You are not authenticated to view this page"
       });
    }
}; 

/**
 * This function is used to find the current active user on the website 
 * we use JWT tokens to verify the a particular user with a role on the 
 * website Used for testing and finding the current user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt; 
    console.log("Token ", token);
    if(token) {

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log("Could not verify token"); 
                console.log(err.message); 
                res.locals.user = null; 
                next(); 

            } else {
                const user = await User.findById(decodedToken.UserInfo.userId, { password: 0, __v: 0});
                console.log(`The currently user is ${user}`); 
                res.locals.user = user;
                next(); 
            }
        }); 
    } else {
        res.locals.user = null; 
        next(); 
    }
}; 

/**
 * This function is part of the middleware which makes the 
 * makes the role based functions a reality and can contains 
 * parameters which are roles like {Admin, Mentor, NCG} 
 * taken from the ./middleware/auth_permissions.js
 * 
 * Use and application : It aids in restricting roles from accessing
 * a particular endpoint.  
 * @param  {...any} allowedRoles 
 * @returns 
 */

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles) return res.status(401).json({
            message: "verifing roles failed"
        });
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.roles);
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.status(401).json({
            message: "You don't have access for role"
        }); 
        next();
    };
}

module.exports = {
    requireAuth, checkUser, verifyRoles
};
