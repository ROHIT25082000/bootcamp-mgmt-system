/**
 * @author team bootcamp-41 2022
 *  
 * This is a controller written for User routes.  
 * 
 */
const mongoose = require('mongoose');
const User = require('../models/user_model');
/**
 * 
 * function getAllUsers is used to get all the 
 * users in the DB 
 * @param  req 
 * @param  res 
 */


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, {password: 0}); 
        res.status(200).json({
            message: "Get request to all users", 
            userList: users
        }); 

    } catch(err) {
        res.status(400).json({
            message: err.message
        }); 
    }
}

/**
 * function getUserById is used to get the specific user 
 * from the database . 
 * 
 * @param {request} req 
 * @param {respose} res 
 * @returns json
 */


const getUserById = async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send(JSON.stringify({ message: "NoUser" }));
        }

        const user = await User.findById({_id: req.params.id});
        if (!user) {
            return res.status(404).send(JSON.stringify({ message: "NoUser" }));
        }

        const r = {
            email: user.email, 
            name: user.name, 
            BU: user.BU,
            role: user.role,
            qualification: user.qualification,
            team_id: user.team_id
        }
        res.status(200).json({
            message: "user",
            userObject: r
        });  

    } catch(err) {
        res.status(400).json({
            message: err.message
        }); 
    }
}

/**
 * 
 * function deleteUserById is used to delete a User
 * with given passed id
 * 
 * @param {request} req 
 * @param {respose} res 
 * @returns json
 */


const deleteUserById = async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send(JSON.stringify({ message: "NoUser" }));
        }

        const deletedUser = await User.findOneAndDelete({_id: req.params.id});
        if(!deletedUser) {
            return res.status(404).send(JSON.stringify({ message: "NoUser" }));
        }

        const response = {
            email: deletedUser.email, 
            name: deletedUser.name, 
            BU: deletedUser.BU,
            role: deletedUser.role,
            qualification: deletedUser.qualification,
            team_id: deletedUser.team_id
        }
        res.status(200).json({
            message: "deleted", 
            deletedUserObject : response 
        })

    } catch(err) {
        res.status(400).json({
            message: err
        }); 
    }
}
/**
 *  logoutUser this deletes the client side jwt token and causes user to be redirected to 
 *  login page
 * @param {request} req 
 * @param {response} res 
 */


const logoutUser = (req, res) => {
    console.log("Tried to logout");
    res.cookie('jwt', '', {httpOnly: false, maxAge:1});
    res.status(200).json({ 
        message: "cookiesdeleted"
    });
}
/**
 * function updateUserDetails is used to update the 
 * user details 
 * @param {request} req 
 * @param {response} res 
 * @returns json
 */


const updateUserDetails = async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send(JSON.stringify({ message: "NoUser" }));
        }

        const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {
            ...req.body
        },{new: true}); 

        if(!updatedUser) {
            return res.status(404).send(JSON.stringify({ message: "NoUser" }));
        }

        const response = {
            email: updatedUser.email, 
            name: updatedUser.name, 
            BU: updatedUser.BU,
            role: updatedUser.role,
            qualification: updatedUser.qualification,
            team_id: updatedUser.team_id
        }

        res.status(200).json({
            message: "User updated", 
            updatedUserObject: response
        });

    } catch(err) {
        res.status(400).json({
            message: err.message
        }); 
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    deleteUserById,
    logoutUser,
    updateUserDetails
};