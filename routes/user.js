/**
 * @author team bootcamp-41 2022
 */
/**
 * This is a set of routes defined in the REST API for User model 
 */
const express = require('express');
const router = express.Router();
const { verifyRoles } =  require('../middleware/auth_middleware');
const { roles } = require('../middleware/auth_permissions');

const { 
    getAllUsers,
    getUserById,
    deleteUserById,
    logoutUser,
    updateUserDetails
} = require('../controllers/user_controller');


// GET ALL THE USERS : ACCESS TO ALL ROLES 
router.get('/',  verifyRoles(roles.ADMIN, roles.MENTOR, roles.NCG), getAllUsers);
// GET A SPECIFIC USERS : ACCESS TO ALL ROLES 
router.get('/:id', verifyRoles(roles.ADMIN, roles.MENTOR, roles.NCG) ,getUserById);  
// DELETE A USER : ONLY ACCESS TO ONLY ADMINS
router.delete('/:id', verifyRoles(roles.ADMIN) ,deleteUserById); 

// GET REQUEST FOR LOGGING OUT A USER : ACCESS TO ALL ROLES
router.get('/logout/del', verifyRoles(roles.ADMIN, roles.MENTOR, roles.NCG), logoutUser); 

// PATCH A ROLE IS USED TO CHANGE THE ROLE OF A PARTICULAR USER : ACCESS TO ONLY ADMINS
router.patch('/:id', verifyRoles(roles.ADMIN), updateUserDetails); 

module.exports = router;