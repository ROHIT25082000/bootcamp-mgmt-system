/**
 * @author team bootcamp-41 2022
 */
const express = require('express');
const router = express.Router(); 

const {
    getAllSubmissions, getSubmissionById, getLeaderboard, createSubmission, evaluateSubmission, deleteSubmission, do_relative_grading
} = require('../controllers/submission_controller');  

const { requireAuth, verifyRoles } = require('../middleware/auth_middleware');
const {roles } = require('../middleware/auth_permissions');

// GET REQUEST TO GET ALL THE SUBMISSIONS : ACCESS TO ONLY ADMIN 
router.get('/', verifyRoles(roles.ADMIN) ,getAllSubmissions);  
// GET A SPECIFIC SUBMISSIONS : ACCESS TO ONLY ADMIN
router.get('/:id', verifyRoles(roles.ADMIN),getSubmissionById); 
// GETS VIEW AT THE LEADER BOARD : ACCESS TO EVERYBODY ADMIN, MENTOR, NCG 
router.get('/results/leaderboard',verifyRoles(roles.ADMIN, roles.MENTOR, roles.NCG) ,getLeaderboard); 
// POST REQUEST IS USED TO MAKE A SUBMISSION WHICH CAN BE ONY DONE BY THE NCG ROLE
router.post('/', verifyRoles(roles.NCG), createSubmission);
// PATCH REQUEST TO EVALUATE A SUBMISSION OF AN NCG OR A TEAM 
router.patch('/:id', verifyRoles(roles.ADMIN) ,evaluateSubmission); 
/*  Just for testing  */ 

// delete route 
router.delete('/:id', requireAuth ,deleteSubmission)

// GET REQUEST TRIGGERED BY THE ADMIN TO GIVE RELATIVE GRADING TO ALL THE INDIVIDUAL ASSIGNMENT BY EACH NCG 
// BASED ON THE MARKS OF THE MAXIMUM MARK OF AN PARTICULAR NCG. THIS PROVIDES AUTOMATIC HIGHER PREFERENCE TO 
// ASSIGNMENT WITH MORE MAXIMUM MARKS .
router.get('/evaluate/relative_grading_for_individual_submissions', verifyRoles(roles.ADMIN), do_relative_grading); 

module.exports = router;
            