/**
 * @author team bootcamp-41 2022
 */

const mongoose = require('mongoose');
const Assignment = require('../models/assignment_model');

// localhost:4000/api/assignments?type={'all', 'project', 'team'}
/**
 * GET ALL THE ASSIGNMENTS 
 * @param {*} req 
 * @param {*} res 
 * @returns JSON OBJECT WITH 
 * APPROPRIATE RESPONSE
 * STATUS CODE 
 * 400 
 * 200 
 */
const getAssignments = async (req, res) => {
    // res.json({message : "GET route to all assignment . This includes Team Assignment, Indiviudal Assignments, Projects"});
    try {

        const current_type = req.query['type'].toLowerCase();

        if (current_type === 'all') {
            const assignments = await Assignment.find({}); 
            res.status(200).json({
                message: "Get request to all Assignment all Team, Individual, project", 
                assignmentList: assignments
            }); 
        } else if(current_type === 'project') {

            const assignments = await Assignment.find({isProject: true}); 
            res.status(200).json({
                message: "Get request to all projects", 
                assignmentList: assignments
            }); 


        } else if(current_type === 'team') {

            const assignments = await Assignment.find({isProject: false, isTeamAssignment: true}); 
            res.status(200).json({
                message: "Get request to all Team assignment ", 
                assignmentList: assignments
            }); 


        } else if(current_type === 'individual') {

            const assignments = await Assignment.find({isProject: false, isTeamAssignment: false}); 
            res.status(200).json({
                message: "Get request to all Individual", 
                assignmentList: assignments
            });

        } else {
            return res.status(400).json({
                message: "Please provide appropriate query parameters [all, project, team, individual]"
            }); 
        }
    } catch(err) {
        res.status(400).json({
            message: err.message
        }); 
    }
}
/**
 * POST REQUEST TO AN ASSIGNMENT
 * @param {*} req 
 * @param {*} res 
 * @returns JSON RESPONSE
 * FOR MAKING POST OPERATION
 * WITH STATUS CODE 
 * 400 - BAD REQUEST 
 * 200 - SUCCESS
 */
const postAssignment = async (req, res) => {
     // res.json({message : 'POST route to post a Team assignment, Individual Assignment, Project'});  
     try {
        const date_string = req.body.deadlineDate.split('/');
        const deadline_date = new Date(Number(date_string[0]), Number(date_string[1]) - 1, Number(date_string[2]));
        const current_date = new Date();  

        if (current_date > deadline_date) {
            return res.status(400).json({
                message: "start date should be before deadline" 
            });
        }
        const current_assignment = {
            assignmentName: req.body.assignmentName,  
            assignmentDescriptions: req.body.assignmentDescriptions,
            assignmentRepositoryUrl: req.body.assignmentRepositoryUrl,
            postingDate: current_date,
            deadlineDate: deadline_date, 
            isProject: req.body.isProject,  
            isTeamAssignment: req.body.isTeamAssignment,
            maximumMarks: req.body.maximumMarks,
            grading: req.body.grading
        }; 
        if(current_assignment.isProject && current_assignment.isTeamAssignment) {
            return res.status(400).json({
                message: "Assignment can't be both project and teamAssignment"
            }); 
        }    
        const newAssignment = await Assignment.create(current_assignment);
        res.status(200).json(newAssignment);   

    } catch(err) {
        res.status(400).json({
            message: err.message
        }); 
    }
}
/**
 * DELETE REQUEST TO DELETE AN ASSIGNEMT
 * @param {*} req 
 * @param {*} res 
 * @returns JSON INDICATING 
 * THE STATUS OF THE OPERATION
 * WHICH MAKES DELETE ASSIGNMENTS 
 * POSSIBLE
 */
const deleteAssignment = async (req, res) => {
     // res.json({message: "DELETE route to delete a Team assignment, Individual Assignment, Project"});   
     try {

        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "There is no such assignment" });
        }

        const deletedAssignment = await Assignment.findOneAndDelete({_id: req.params.id});
        if(!deletedAssignment) {
            return res.status(404).json({
                message: "There is a no such assignment"
            });
        }

        res.status(200).json({
            message: "Successfully Deleted Assignment", 
            deletedAssignmentObject : deletedAssignment 
        })

    } catch(err) {
        res.status(400).json({
            message: err.message
        }); 
    }
}
/**
 * PATCH REQUEST
 * @param {*} req 
 * @param {*} res 
 * @returns JSON RESPONSE 
 * INDICATING THE STATUS 
 * OF THE PATCH REQUEST
 * 400 - BAD REQUEST 
 * 200 - SUCCESS
 */
const updateAssignment = async (req, res) => {
    // res.json({message: 'UPDATE route to update a Team assignment, Individual Assignment, Project'});   
    try {
   
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "There is no such Assignment" });
        }

        // doing a get operations on the isProject and isTeamAssignemt 
        const storedObjectInDB = await Assignment.findOne({_id: req.params.id}); 

        if(!storedObjectInDB) {
            return res.status(404).json({
                message: "There is a no such assignment to update"
            }); 
        }
        
        // store their current state which would be valid. 

        let old_IsProject = storedObjectInDB.isProject;  
        let old_IsTeamAssignment = storedObjectInDB.isTeamAssignment; 


        // update them 
        if(typeof req.body.isProject !== "undefined") {
            old_IsProject = req.body.isProject;
        } 

        if(typeof req.body.isTeamAssignment !== "undefined") {
            old_IsTeamAssignment = req.body.isTeamAssignment; 
        }

        // check the new state 
        if(old_IsProject && old_IsTeamAssignment) {
            return res.status(400).json({
                message: "Assignment can't be both project and teamAssignment"
            }); 
        }

        // if(typeof req.body.postingDate !== "undefined") {
        //     req.body.postingDate = moment(new Date(req.body.postingDate)).format('YYYY-MM-DD[T00:00:00.000Z]');
        // } 

        if(typeof req.body.deadlineDate !== "undefined") {
            // req.body.deadlineDate = moment(new Date(req.body.deadlineDate)).format('YYYY-MM-DD[T00:00:00.000Z]');    
            const date_string = req.body.deadlineDate.split('/');
            const deadline_date = new Date(Number(date_string[0]), Number(date_string[1]) - 1, Number(date_string[2]));;
            const current_date = new Date();  
            if (current_date > deadline_date) {
                return res.status(400).json({
                    message: "start date should be before deadline" 
                });
            }
        }

        const updatedAssignment = await Assignment.findOneAndUpdate({_id: req.params.id},{...req.body}, {new: true}); 

        if(!updatedAssignment) {
            return res.status(404).json({
                message: "There is a no such assignment to update"
            }); 
        }

        res.status(200).json({
            message: "Assignment updated", 
            updatedAssignmentObject: updatedAssignment
        });  
    } 
    catch(err) {
        res.status(400).json({
            message: err.message
        }); 
    } 
}

module.exports = {
    getAssignments,
    postAssignment,
    deleteAssignment,
    updateAssignment
}