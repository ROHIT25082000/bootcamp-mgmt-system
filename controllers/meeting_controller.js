/**
 * @author team bootcamp-41 2022
 */
const Meeting = require('../models/meeting_model');
const mongoose = require('mongoose');
// get all

/**
 * GETS ALL THE MEET WITH HELP 
 * OF THE QUERY PARAMETERS 
 * @param {*} req 
 * @param {*} res 
 * @returns A JSON RESPONE WITH A MESSAGE
 *  THE FOLLOWING STATUS CODES 
 * 200 FOR SUCCESS 
 * 400 FOR ALL OTHER FAILURES 
 * 
 */
const getAllMeetings = async (req, res) => {
     // res.json({message : "GET route to all meeting"});
    try {
        
        const current_type = req.query['type'].toLowerCase();
        if (current_type === 'recorded') {
            const meeting = await Meeting.find({isRecorded: true}, {__v: 0}); 
            res.status(200).json({
                message: "Get request to all meeting", 
                meetingList: meeting
            }); 
        } else if(current_type === 'live') {
            const meeting = await Meeting.find({isRecorded: false}, {__v: 0}); 
            res.status(200).json({
                message: "Get request to the only live meeting", 
                meetingList: meeting
            }); 
        } else {
            return res.status(400).send(JSON.stringify({message: "invalidQueryParam"}));
        }
        
    } catch(err) {
        res.status(400).json({
            message: err
        }); 
    }
}
/**
 * GET THS A SPECIFIC MEET
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

const getMeetingById = async (req, res) => {
    try {

        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send(JSON.stringify({ message: "NoMeet" }));
        }

        const meeting = await Meeting.findById({_id: req.params.id});
        if (!meeting) {
            return res.status(404).send(JSON.stringify({ message: "NoMeet" }));
        }
        // meeting['startTime'] = changeISOToReadable(meeting['startTime']);
        // meeting['endTime'] =  changeISOToReadable(meeting['endTime']);

        res.status(200).json({
            message: "Here is the meeting you asked for",
            meetObject: meeting
        });  

    } catch(err) {
        res.status(400).json({
            message: err
        }); 
    }
}
/**
 * POST A MEET
 * @param {*} req 
 * @param {*} res 
 * @returns JSON RESPONSE FOR THE 
 * STATUS OF THE API CALL WITH
 * AN APPROPRIATE MESSAGE
 */
const postMeeting = async (req, res) => {
     // res.json({message : 'POST route to post a meeting '});   
     try {
        
        if(req.body.isRecorded) {
            console.log(typeof req.body.isRecorded);
            console.log("Recored meeting is getting saved "); 
            const recordedObject = {
                                    zoomlink: req.body.zoomlink,
                                    meetTitle: req.body.meetTitle, 
                                    meetDescription: req.body.meetDescription,
                                    isRecorded: req.body.isRecorded
                                }
            const meeting = await Meeting.create(recordedObject);
            const response = {
                zoomlink: meeting.zoomlink,
                meetTitle: meeting.meetTitle,
                meetDescription: meeting.meetDescription, 
                isRecorded: meeting.isRecorded
            }
            res.status(200).json({
                message: "Posted a recorded meeting",
                meetObject: response
            }); 
        } else { 
            console.log("Live meeting is getting saved "); 
            const todayAnyMeet = await Meeting.findOne({isRecorded: false});
            if(todayAnyMeet) {
                return res.status(400).send(JSON.stringify({message: "OnLiveMeet"}));
            }

            let [startTimeYear, startTimeMonth, startTimeDate, startTime]  = req.body.startTime.split('/'); 
            console.log(startTimeYear, startTimeMonth, startTimeDate, startTime);
            
            // creating a startTime object 
            const dateObjectStart = new Date(Number(startTimeYear), // YEAR
                                        Number(startTimeMonth) - 1, // MONTH , we have to substract one in javascript 
                                        Number(startTimeDate),      // Date
                                        Number(startTime.split(":")[0]), //hours
                                        Number(startTime.split(":")[1]), // minutes
                                        0,  // seconds
                                        0); // seconds

            let [endTimeYear, endTimeMonth, endTimeDate, endTime] = req.body.endTime.split('/');  
            console.log(endTimeYear,endTimeMonth, endTimeDate, endTime);
            const current_date = new Date(); 
            const dateObjectEnd = new Date(Number(endTimeYear), // YEAR
                                        Number(endTimeMonth) - 1, // MONTH , we have to substract one in javascript 
                                        Number(endTimeDate),      // Date
                                        Number(endTime.split(":")[0]), //hours
                                        Number(endTime.split(":")[1]), // minutes
                                        0,  // seconds
                                        0); // seconds

            if (dateObjectStart > dateObjectEnd) {
                return res.status(400).send(JSON.stringify({message: "Start time can't be after end time"}));
            }
            if(dateObjectStart < current_date) {
                return res.status(400).send(JSON.stringify({message: "Start time can't be in past"}));
            }
            const meeting = {
                zoomlink: req.body.zoomlink,
                meetTitle:req.body.meetTitle,
                meetDescription: req.body.meetDescription,
                isRecorded: false,
                startTime: dateObjectStart.toISOString(),
                endTime: dateObjectEnd.toISOString()
            };
            const addedMeet = await Meeting.create(meeting);
            res.status(200).json({
                message: "added meet",
                meetObject: addedMeet
            });
        }
    } catch(err) {
        res.status(400).json({
            message: err.message
        }); 
    }
}

/**
 * DELETES A MEETING BY ID  
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteMeeting = async (req, res) => {
    // res.json({message: "DELETE route to specific meeting"}); 
    try {

        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send(JSON.stringify({ message: "NoMeet" }));
        }

        const deletedMeeting = await Meeting.findByIdAndDelete({_id: req.params.id});
        if(!deletedMeeting) {
            return res.status(404).send(JSON.stringify({ message: "NoMeet" }));
        }
        res.status(200).json({
            message: "Successfully Deleted ", 
            deletedUserObject : deletedMeeting 
        })
    } catch(err) {
        res.status(400).json({
            message: err
        }); 
    }
}
/**
 * MEETING IS UPDATED WITH THE CONFLICTS IN THE MIND 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateMeeting = async (req, res) => {
     // res.json({message: 'UPDATE route to update a meeting'});   
     try {
        // check the id of the meeting. 
       
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send(JSON.stringify({ message: "NoMeet" }));
        }

        const currentMeeting = await Meeting.findById({_id: req.params.id}, {startTime: 1, endTime: 1}); 
        if(!currentMeeting) {
            return res.status(404).json(JSON.stringify({message: "There is not such meeting with passed id"})); 
        }

        let hasStartChanged = false; 
        let hasEndChanged = false; 

        const changeToApply = { }; 

        let currStartTime = currentMeeting.startTime; // get the currently valid stored start time 
        console.log(currStartTime);
        let currEndTime = currentMeeting.endTime;  // get the currently valid stored end time
        console.log(currEndTime); 

        if(typeof req.body.zoomlink !== "undefined") {
            changeToApply['zoomlink'] = req.body.zoomlink;
        }
        if(typeof req.body.meetTitle !== "undefined") {
            changeToApply['zoomlink'] = req.body.meetTitle;
        }
        if(typeof req.body.meetDescription !== "undefined") {
            changeToApply['meetDescription'] = req.body.meetDescription;
        }

        if(typeof req.body.startTime !== "undefined") {
            
            let [startTimeYear, startTimeMonth, startTimeDate, startTime]  = req.body.startTime.split('/'); 
            console.log(startTimeYear, startTimeMonth, startTimeDate, startTime);

            changeToApply['startTime'] = new Date(Number(startTimeYear), // YEAR
                                            Number(startTimeMonth) - 1, // MONTH , we have to substract one in javascript 
                                            Number(startTimeDate),      // Date
                                            Number(startTime.split(":")[0]), //hours
                                            Number(startTime.split(":")[1]), // minutes
                                            0,  // seconds
                                            0).toISOString();
            hasStartChanged = true;
        }

         // does the patch request have an score  
        if(typeof req.body.endTime !== "undefined") {
        
            let [endTimeYear, endTimeMonth, endTimeDate, endTime] = req.body.endTime.split('/');  
            console.log(endTimeYear,endTimeMonth, endTimeDate, endTime);

            changeToApply['endTime'] = new Date(Number(endTimeYear), // YEAR
                                        Number(endTimeMonth) - 1, // MONTH , we have to substract one in javascript 
                                        Number(endTimeDate),      // Date
                                        Number(endTime.split(":")[0]), //hours
                                        Number(endTime.split(":")[1]), // minutes
                                        0,  // seconds
                                        0).toISOString(); // seconds
            hasEndChanged = true;
        }
        // If neither the start has not changed nor the end then simply go and update the meeting. 
        if (!(hasStartChanged || hasEndChanged)) {
            const updatedMeeting = await Meeting.findByIdAndUpdate({_id: req.params.id}, {...changeToApply}, {new: true}); 
            res.status(200).json({
                message : "Updated the meeting time",
                updatedMeetingObject: updatedMeeting
            });
        } else {  
            // something has changed Either the startTime or the endTime.
            if(!hasStartChanged) { // so if start has not changed we keep old start itself  
                changeToApply['startTime'] = currStartTime;
            }
            if(!hasEndChanged) {    // so if end has not changed we keep the old end itself 
                changeToApply['endTime'] = currEndTime;
            }

            const conflictExists = await Meeting.find({
                $or: [
                        {
                            $and: [
                                    {
                                        startTime: {
                                                $lte: changeToApply['startTime']
                                            }
                                    }, 
                                    {
                                        endTime : {
                                                $gte: changeToApply['startTime']
                                            }
                                    }
                            ]
                        }, {
                            $and: [
                                    {
                                        startTime : {
                                                $lte: changeToApply['endTime']
                                            }
                                    }, 
                                    {
                                        endTime : {
                                                $gte: changeToApply['endTime']
                                            }
                                    }
                            ]
                        }, {
                            $and: [
                                    {
                                        startTime : {
                                                $gte: changeToApply['startTime']
                                            }
                                    }, 
                                    {
                                        endTime: {
                                                $lte: changeToApply['endTime']
                                        }
                                        
                                    }
                            ]
                        }
                    ]
            }); 
        if(conflictExists.length > 0) {
            return res.status(400).json({
                message: "Your has conflict some other meeting today"
            }); 
        }

        const updatedMeeting = await Meeting.findByIdAndUpdate({_id: req.params.id}, {...changeToApply}, {new: true}); 
        res.status(200).json({
            message: "Score updated", 
            updatedMeetingObject : updatedMeeting
        });

        }
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }

}


module.exports = {
    getAllMeetings, 
    getMeetingById,
    postMeeting,
    deleteMeeting,
    updateMeeting
}