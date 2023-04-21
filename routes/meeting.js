/**
 * @author team bootcamp-41 2022
 */
const express = require('express');
const { getAllMeetings, getMeetingById, postMeeting, deleteMeeting, updateMeeting } = require('../controllers/meeting_controller');
const { requireAuth, verifyRoles } = require('../middleware/auth_middleware');
const { roles } = require('../middleware/auth_permissions');
const router = express.Router();

// GET REQUEST TO MEETINGS AND HAS A QUERY PARAMETER TO FIND THE MEETINGS 
// WHICH CAN BE QUERIED BASED ON LIVE OR RECORDED MEETING

// ACCESS TO THE ALL THE CREATE AND EDIT OPERATION IS ONLY FOR ADMIN
// READ OPERATION OF MEETING IS AVAILABLE TO ALL ENTITIES

router.get('/', verifyRoles(roles.ADMIN, roles.MENTOR, roles.NCG) ,getAllMeetings); 
// GET A SPECIFIC MEETING  
router.get('/:id', verifyRoles(roles.ADMIN, roles.MENTOR, roles.NCG) ,getMeetingById); 
//  POST A MEETING 
router.post('/', verifyRoles(roles.ADMIN) ,requireAuth ,postMeeting); 
// DELETE A MEETING BASED ON ID
router.delete('/:id', verifyRoles(roles.ADMIN) ,deleteMeeting)
// update route 
router.patch('/:id', verifyRoles(roles.ADMIN) ,updateMeeting);
module.exports = router;