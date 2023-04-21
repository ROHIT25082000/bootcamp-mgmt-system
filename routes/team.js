/**
 * @author team bootcamp-41 2022
 */
const express = require('express');
const router = express.Router();

const {
    getAllTeams,
    getTeamById,
    deleteTeamById,
    createTeam,
    editTeamProject
} = require('../controllers/team_controller'); 
const { requireAuth, verifyRoles } = require('../middleware/auth_middleware');
const {roles } = require('../middleware/auth_permissions');

// GET ALL THE TEAMS : ACCESS TO ALL ROLES 
router.get('/', verifyRoles(roles.ADMIN) ,getAllTeams); 
// GET A SPECIFIC TEAM : ACCESS TO ALL ROLES 
router.get('/:id', verifyRoles(roles.ADMIN, roles.MENTOR, roles.NCG),getTeamById); 
// DELETE A TEAM : ACCESS TO ONLY ADMINS
router.delete('/:id', verifyRoles(roles.ADMIN) ,deleteTeamById); 
// CREATE A TEAM : ACCESS TO ADMINS
router.post('/', verifyRoles(roles.ADMIN) ,createTeam);  
// PATCH REQUEST TO UPDATE THE PROJECT_ID FILES
router.patch('/:id',  verifyRoles(roles.ADMIN) ,editTeamProject);
module.exports = router;
