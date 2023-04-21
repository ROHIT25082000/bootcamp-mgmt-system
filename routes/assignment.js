const express = require('express');
const router = express.Router(); 

const { getAssignments, postAssignment, deleteAssignment, updateAssignment } = require('../controllers/assignment_controller');
const { requireAuth, verifyRoles } = require('../middleware/auth_middleware');
const {roles } = require('../middleware/auth_permissions');
// get all 
router.get('/', verifyRoles(roles.ADMIN, roles.MENTOR, roles.NCG) ,getAssignments);
//  Post an assignment route 
router.post('/', verifyRoles(roles.ADMIN), postAssignment);
// Delete an assignment with a given id 
router.delete('/:id', verifyRoles(roles.ADMIN) ,deleteAssignment); 
// Update an assignment with the given id 
router.patch('/:id', verifyRoles(roles.ADMIN) ,updateAssignment); 

module.exports = router;