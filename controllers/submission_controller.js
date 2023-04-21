/**
 * @author team bootcamp-41 2022
 */
const Submission = require('../models/submission_model'); 
const Team = require('../models/team_model'); 
const moment = require('moment');
const Assignment = require('../models/assignment_model');
const User = require('../models/user_model'); 
const mongoose = require('mongoose');


const getAllSubmissions = async (req, res) => {
    // res.json({message : "GET route to all submission"}); 
    try {
        const submissions = await Submission.find({}).populate('assignment_id', 'assignmentName'); 
        res.status(200).json({
            message: "Get request to all submission", 
            submissionList: submissions
        }); 

    } catch(err) {
        res.status(400).json({
            message: err
        }); 
    }
}

const getSubmissionById = async (req, res) => {
    try {

        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "There is no such submission" });
        }

        const submission = await Submission.findById({_id: req.params.id});
        if (!submission) {
            return res.status(404).json({
                message: 'There is no such submission'
            });
        }

        res.status(200).json({
            message: "Here is the user you asked for",
            submissionObject: submission
        });  

    } catch(err) {
        res.status(400).json({
            message: err
        }); 
    }
}

const getLeaderboard = async (req, res) => {
    try {
        const submission_type = req.query['type'].toLowerCase();
        if (submission_type === 'project') {
            const projects = await Submission.find({isProject: true, isEvaluted: true}).sort({score: -1}); 
            res.status(200).json({
                message: "Get request to all Project", 
                projectList: projects
            }); 
        }
        else if(submission_type === 'team') {
            const team_assignments = await Submission.find({isProject: false, user_id: null, isEvaluted: true}).sort({score: -1}); 
            res.status(200).json({
                message: "Get request to all team assignment", 
                teamAssignmentList: team_assignments
            }); 
        }
        else if(submission_type === 'individual') {
            const individual_assignments = await Submission.find({isProject: false, team_id: null, isEvaluted: true}).populate('user_id', 'email name').populate('assignment_id', 'assignmentName').sort({score: -1}); 
            res.status(200).json({
                message: "Get request to all individual assignment", 
                individualAssignmentList: individual_assignments
            }); 
        } else {
            return res.status(400).json({
                message: "Invalid request try to provide proper query parameters [project, team, individual]"
            })
        }
    } catch(err) {
        res.status(400).json({
            message: err.message
        });
    }
}


const createSubmission = async (req, res) => {
    try {
        if(req.body.isProject) {

            if(typeof req.body.team_id === "undefined") {
                return res.status(400).json({
                    message: "You can't have submission as it is invalid "
                });
            }

            if(typeof req.body.user_id !== "undefined") {
                return res.status(400).json({
                    message: "You can't have submission as it is invalid "
                });
            }

            const team = await Team.findOne({_id: req.body.team_id}); 
            if(!team) {
                return res.status(400).json({
                    message: "There is no such team"
                });
            }

            // Does the team own the project or not 
            //mongoose.Schema.Types.ObjectId.isValid(req.body.assignment_id);

            const team_project_id = String(team.project_id);

            if(req.body.assignment_id !== team_project_id) {
                return res.status(400).json({
                    message: "Your team doesn't own this project"
                }); 
            }

            const assignment = await Assignment.findOne({_id: req.body.assignment_id, isProject: true}); 
            if(!assignment) {
                return res.status(400).json({
                    message: "Invalid assignment id Or it is not a project", 
                }); 
            }

            const current_date = new Date();  

            const submission = {
                isProject: req.body.isProject,
                team_id: req.body.team_id,
                submissionDate: current_date,
                submissionOrAttachment: req.body.submissionOrAttachment,
                assignment_id: req.body.assignment_id
            };

            const submissionObject = await Submission.create(submission); 
            res.status(200).json({
                message: "Successfully submitted",
                submittedObject: submissionObject
            });

        } else { // If it is a team assignment or individual assignment 

            if(typeof req.body.team_id !== "undefined" && typeof req.body.user_id !== "undefined") {
                return res.status(400).json({
                    message: "You can't have submission as it is invalid "
                });
            }

            if(typeof req.body.user_id === "undefined" && typeof req.body.user_id === "undefined") {
                return res.status(400).json({
                    message: "You can't have submission as it is invalid "
                });
            }

            const assignment = await Assignment.findOne({_id: req.body.assignment_id, isProject: false}); 
            if(!assignment) {
                return res.status(400).json({
                    message: "Invalid assignment id or there is no such team or individual assignment", 
                }); 
            }

            const current_date = new Date();   

            const submission = {
                isProject: req.body.isProject,
                submissionDate: current_date,
                submissionOrAttachment: req.body.submissionOrAttachment,
                assignment_id: req.body.assignment_id
            };

            // case1  if team assignment 
            if(typeof req.body.team_id !== "undefined") {
                const team = await Team.findOne({_id: req.body.team_id}); 
                
                if(!team) {
                    return res.status(400).json({
                        message: "There is no such team"
                    }); 
                }
                submission['team_id'] = req.body.team_id;
            }

            // case2  if individual assignemt
            if(typeof req.body.user_id !== "undefined") {
                const user = await User.findOne({_id: req.body.user_id}); 
                
                if(!user) {
                    return res.status(400).json({
                        message: "There is no such user"
                    }); 
                }
                submission['user_id'] = req.body.user_id;
            }

            const submissionObject = await Submission.create(submission); 
            res.status(200).json({
                message: "Successfully submitted",
                submittedObject: submissionObject
            });

        }

    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }
}


const evaluateSubmission = async (req, res) => {
    try {
        // check id of the submission
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "There is no such submission" });
        }
        // does the patch request have an evaluator 
        if(typeof req.body.evaluator_id === "undefined") {
            return res.status(400).json({
                message: "Please patch an evaluator_id "
            });
        }
         // does the patch request have an score  
        if(typeof req.body.score === "undefined") {
            return res.status(400).json({
                message: "Please patch a score"
            });
        }


        // check whether the id of the evaluator is valid 
        if(!mongoose.Types.ObjectId.isValid(req.body.evaluator_id)) {
            return res.status(400).json({ message: "There is no such evaluator id is not valid" });
        }

        // check whether the valid id of evaluator exists 
        const evaluatorExists = await User.findOne({_id: req.body.evaluator_id, role: 'admin'});
        if(!evaluatorExists) {
            return res.status(400).json({ message: "There is no such evaluator." });
        }

        // check is whether passed submission exists 
        const submission = await Submission.findById({_id: req.params.id}, {isEvaluted: 1, assignment_id: 1});
        if (!submission) {
            return res.status(404).json({
                message: 'There is no such submission'
            });
        }

        // check whether submission evaluated 
        if(!submission.isEvaluted) {

            // find the maximum marks for that particular assignment for which submission was done 
            const checkAssignmentMaximumMarks = await Assignment.findById({_id: submission.assignment_id}, {maximumMarks: 1});

            // if evalut
            const passedScore = req.body.score; 

            if(passedScore > checkAssignmentMaximumMarks.maximumMarks || passedScore < 0) {
                return res.status(400).json({
                    message: "You are giving more marks than Maximum Marks or giving less than 0"
                }); 
            }

            const evaluation = {
                isEvaluted: true,
                score: passedScore,
                evaluator_id: req.body.evaluator_id
            };

            const UpdatedSubmission = await Submission.findByIdAndUpdate({_id: req.params.id}, {...evaluation}, {new: true}); 
            res.status(200).json({
                message: "Score updated"
            });

        } else {
            return res.status(400).json({
                message :  "Submission Already evaluated"
            }); 
        }

    } catch(err){
        res.status(400).json({
            message: err.message
        });
    }
}; 

const do_relative_grading = async(req, res) => {
    // find all individual evaluated assignments 
    try {   

        const thereExistsUnevaluatedIndividualAssignment = await Submission.findOne({isProject: false, team_id: null, isEvaluted: false});
        if(thereExistsUnevaluatedIndividualAssignment) {
            return res.status(400).send(JSON.stringify({"message":"Some Individual Assignments are not evaluated yet"}));
        }
        let maxMark = -1;
        const highestScoredIndividualAssignment = await Submission.find({isProject: false, team_id: null ,isEvaluted: true}).sort({score: -1}).limit(1);
        if(highestScoredIndividualAssignment.length === 0) {
            return res.status(400).send(JSON.stringify({"message":"Some Individual Assignments are not evaluated yet so highest could not be calculated"}));
        }
        maxMark = highestScoredIndividualAssignment[0].score; 
        console.log("MaxMark ", maxMark + "\n");
        const getAllIndividualAssignments = await Submission.find({isProject: false, team_id: null, isEvaluted: true}); 
        
        for(let i = 0; i < getAllIndividualAssignments.length; ++i) {
            // update each assignment with relative grade
            const current_id = getAllIndividualAssignments[i]._id;
            const given_score = getAllIndividualAssignments[i].score;  
            const relative_score = parseInt(((given_score * 1.0)/(maxMark)) * 100);
            console.log(relative_score, " calculated from ", given_score, " ", maxMark + " ");
            const updated_assignment = await Submission.updateOne({_id: current_id}, {$set: {score: relative_score}});
            if(updated_assignment) {
                console.log("current_id ", current_id, " score updated");
            }
        }
        res.status(200).send(JSON.stringify({message: "relative evaluation done for individual assignment"}));
    
    } catch(err) {
        res.send({message: err.message});
    }
}

const deleteSubmission = async (req, res) => {
    // res.json({message: "DELETE route to specific meeting"}); 
    try {

        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "There is no such submission" });
        }

        const deletedSubmission = await Submission.findOneAndDelete({_id: req.params.id}, );
        if(!deletedSubmission) {
            return res.status(404).json({
                message: "There is a no such Submission"
            });
        }

        res.status(200).json({
            message: "Successfully Deleted ", 
            deletedSubmissionObject : deletedSubmission 
        })

    } catch(err) {
        res.status(400).json({
            message: err
        }); 
    }
}


module.exports = {
    getAllSubmissions,
    getSubmissionById,
    getLeaderboard,
    createSubmission,
    evaluateSubmission,
    deleteSubmission,
    do_relative_grading
}; 