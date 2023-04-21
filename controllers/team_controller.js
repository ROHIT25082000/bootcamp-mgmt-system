/**
 * @author team bootcamp-41 2022
 */
const Team = require('../models/team_model');
const User = require('../models/user_model'); 
const Assignment = require('../models/assignment_model');
const mongoose = require('mongoose');

/**
 * GET REQUEST TO ALL TEAMS
 * @param {*} req 
 * @param {*} res 
 * RETURNS A JSON RESPONSE
 * STATING THE STATUSCODE 
 * 400 -BAD REQUEST 
 * 200 -SUCCESS
 */
const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({}); 
        if(teams.length == 0) {
            res.status(200).json({
                message: "Get request to all teams", 
                teamList: teams
            }); 
        } else {

            result = [] 

            for(let i = 0; i < teams.length; ++i) {
                const ncsList = await User.find({team_id: teams[i]._id, role: 'ncg'}, {password: 0, __v: 0, team_id: 0}); 
                const mentors = await User.find({team_id: teams[i]._id, role: 'mentor'}, {password: 0, __v: 0, team_id: 0}); 
                const current_team_project = teams[i].project_id; 
                response_object = {
                    _id: teams[i]._id,
                    ncgs: ncsList,
                    mentor: mentors,
                    project: current_team_project
                }; 
                result.push(response_object); 
            }

            res.status(200).json({
                message: "Get request to all teams", 
                teamList: result
            });
        }
    } catch(err) {
        res.status(400).json({
            message: err.message
        }); 
    }
}
/**
 * GET A SPECIFIC TEAM :- POPULATES THE 
 * REF TO MENTOR  NCGS FOR A DETAILED VIRE 
 * @param {*} req 
 * @param {*} res 
 * @returns RETURNS A
 * TEAM BY ID
 */
const getTeamById = async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send(JSON.stringify({ message: "NoTeam" }));
        }

        const team = await Team.findById({_id: req.params.id});
        if (!team) {
            return res.status(404).send(JSON.stringify({ message: "NoTeam" }));
        }

        const ncgList = await User.find({team_id: team._id, role: 'ncg'}); 
        const mentors = await User.find({team_id: team._id, role: 'mentor'}); 
        const current_team_project = team.project_id; 
        response_object = {
            _id: team._id,
            ncgs: ncgList,
            mentor: mentors,
            project: current_team_project
        }; 

        res.status(200).json({
            message: "Get request to your team successfull",
            teamObject: response_object 
        }); 

    } catch(err) {
        res.status(400).json({
            message: err.message
        });
    }
}

/**
 * DELETE REQUEST TO DELETE A CERTAIN TEAM 
 * THE REFERENCES OF THE REFERRANT ARE SET TO NULL 
 * ON DELETE FOR NCG's AND MENTOR's 
 * @param {*} req 
 * @param {*} res 
 * @returns JSON RESPONSE 
 * BASED ON THE STATUSCODE
 * 400 - BAD PARAMETER
 * 200 - SUCCESS
 */
const deleteTeamById = async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send(JSON.stringify({ message: "NoTeam" }));
        }
    
        const team = await Team.findById({_id: req.params.id});
        if (!team) {
            return res.status(404).send(JSON.stringify({ message: "NoTeam" }));
        }
    
        const ncgList = await User.updateMany({team_id: team._id, role: 'ncg'}, { $set: { team_id : null } }); 
    
        const mentors = await User.updateMany({team_id: team._id, role: 'mentor'}, {$set: {team_id: null}});
        const deletedTeam = await Team.deleteOne({_id: team._id}); 

        res.status(200).json({
            message: "team is deleted and associated ncgs and mentors have been set null in there team_id: field", 
            result: {
                ncgdeleted: ncgList,
                mentorsdeleted: mentors,
                teamdeleted: deletedTeam
            }
        }); 

    } catch(err) {
        res.status(400).json({
            message: err
        });
    } 
}
/**
 * POST A NEW TEAM 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns JSON 
 * RESPONSE FOR MAKING A 
 * NEW TEAM BASED ON THE ARRAY 
 * OF THE ARRAY OF THE 
 * NCGs called ncg_list: ["johndoe@gmail.com" ...]
 * THE ARRAY OF MENTORS 
 * called mentor_list: ["mentor@gmail.com" ...] 
 * it also contains project id 
 * 
 * 
 * DOES GIVE YOU VALIDATION ERRORS ON AN INVALID 
 * REQUEST LIKE 
 * Ex the mentor or ncg already part of a different 
 * team but you are trying to post a team . 
 * 
 * Note: There can be multiple mentors for one team but only 
 * one team per mentor 
 * 
 * Note : There could be multiple teams working on the same 
 * project_id or 
 * 
 * Ex : There are two teams working on "Bootcamp Management System Project"
 * which has same project_id
 */


const createTeam = async (req, res) => {
     // res.json({message : 'POST route to post a team'});  
     try {
        const ncgArray = req.body.ncg_list;
        //console.log(ncgArray[0]); 
        const mentorArray = req.body.mentor_list; 
        //console.log(mentorArray); 
        const project_id = req.body.project_id;
        //console.log(project_id);

        // User validation before addition 
        for(let i = 0; i < ncgArray.length; ++i) {

            // if(!mongoose.Types.ObjectId.isValid(ncgArray[i]._id)) {
            //     return res.status(404).json({ message: `There is no such User with _id : ${ncgArray[i]._id}` });
            // }
            const current_ncg = await User.findOne({email: ncgArray[i], role: 'ncg', team_id: null});
            console.log(current_ncg);
            if(!current_ncg) {
                return res.status(400).json({
                    message: "You are trying to add User who is not ncg or have been already assigned a project"
                }); 
            } 
            //const updatedNCG = await User.updateOne({_id: current_ncg._id}, {$set: {project_id: }})
        }

        // mentor validation before addition 
        for(let i = 0; i < mentorArray.length; ++i) {

            // if(!mongoose.Types.ObjectId.isValid(mentorArray[i]._id)) {
            //     return res.status(404).json({ message: `There is no such User with _id : ${mentorArray[i]._id}` });
            // }
            const current_mentor = await User.findOne({email: mentorArray[i], role: 'mentor', team_id: null});
            if(!current_mentor) {
                return res.status(400).json({
                    message: "You are trying to add a User who is not a mentor or have been already been mentoring a project"
                }); 
            } 
        }

        const project = await Assignment.findOne({_id: project_id, isProject: true, isTeamAssignment: false});
        if(!project) {
            return res.status(400).json({
                message: "Passed project_id is not a valid "
            }); 
        }


        /* We can have a two teams doing same project */

        // const isProjectTakenByOtherTeam = await Team.findOne({project_id: project._id});
        // if(isProjectTakenByOtherTeam) {
        //     return res.status(400).json({
        //         message: "Passed project has already been taken by other team"
        //     })
        // }


        // Both ncgs and mentors are free and is available so we can team them 
        const team = await Team.create({project_id: project._id});
        if(!team) {
            return res.status(400).json({
                message: "Could not create a team"
            })
        }

        for(let i = 0; i < ncgArray.length; ++i) {
            const ncg_updated = await User.updateOne({email: ncgArray[i]}, {$set: {team_id: team._id}});
        }
        for(let i = 0; i < mentorArray.length; ++i) {
            const mentor_updated = await User.updateOne({email: mentorArray[i]}, {$set: {team_id: team._id}})
        }

        res.status(200).json({
            message: "Successfully created a team"
        }); 
        
    } catch(err) {
        res.status(400).json({
            message: err.message
        }); 
    }
}
/**
 * EDITS A TEAM PROJECT 
 * @param {*} req 
 * @param {*} res 
 * @returns JSON 
 * RESPONSE BASED ON RESULT OF THE REQUEST 
 * 404 - BAD REQUEST 
 * 200 - SUCCESS 
 */
const editTeamProject = async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send(JSON.stringify({ message: "NoTeam" }));
        }
    
        const projectId = req.body.project_id;  // get the passed project id 
        
        const project = await Assignment.findById({_id: projectId}); 
        if (!project) {
            return res.status(404).send(JSON.stringify({ message: "NoProject" }));
        }

        const updatedTeam = await Team.findOneAndUpdate({_id: req.params.id}, {
            project_id: projectId
        },{new: true}); 

        if(!updatedTeam) {
            return res.status(404).send(JSON.stringify({ message: "NoTeam" }));
        }

        res.status(200).json({
            message: "Team updated", 
            updatedTeamObject: updatedTeam
        });

    } catch(err) {
        res.status(400).json({
            message: err
        }); 
    }
}


module.exports = {
    getAllTeams, 
    getTeamById,
    deleteTeamById,
    createTeam,
    editTeamProject
};