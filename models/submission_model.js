const mongoose = require('mongoose');
/**
 * We specify the schema of Submissions 
 * -isProject Boolean 
 * -team_id <ref> Team 
 * -user_id <ref> User
 * -submissionDate
 * -score
 * -isEvaluated
 * -submissionOrAttachment
 * -evaluator_id <ref> User
 * -assignment_id <ref> Assignment 
 */

const submissionSchema = mongoose.Schema({
    isProject: {
        type: Boolean,
        required: true
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        default: null
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    submissionDate: {
        type: Date,
        required: true
    },
    score: {
        type: Number,
        integer: true,
        default: 0,
        min: 0,
        max: 1000
    },
    isEvaluted: {
        type: Boolean,
        default: false,
        required: true
    },
    submissionOrAttachment: {
        type: String,
        required: true
    },
    evaluator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    assignment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Assignment_Project',
        required: true
    }
});

// To test whether the URL works or not.  
submissionSchema.path('submissionOrAttachment').validate((val) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');

module.exports = mongoose.model('Submission', submissionSchema); 
