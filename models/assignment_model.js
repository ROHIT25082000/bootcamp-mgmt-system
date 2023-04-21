const mongoose = require('mongoose'); 
/**
 * We specify the schema of a Assignment Entity
 * -assignmentName
 * -assignmentDescriptions
 * -assignmentRepository
 * -postingDate
 * -deadlineDate
 * -isProject
 * -isTeamAssignment
 * -maximumMarks
 * -grading
 */
const assignmentSchema = mongoose.Schema({
    assignmentName: {
        type: String,
        required: true,
    },
    assignmentDescriptions: {
        type: String,
        required: true
    },
    assignmentRepositoryUrl: {
        type: String,
        required: true
    }, 
    postingDate: {
        type: Date,
        required: true,
        immutable: true,
    },
    deadlineDate: {
        type: Date,
        required: true, 
    },
    isProject: {
        type: Boolean,
        required: true
    },
    isTeamAssignment: {
        type: Boolean,
        required: true,
        validate: [booleanValidator, 'You can\'t have Project same as Team Assignment']
    },
    maximumMarks: {
        type: Number,
        integer: true,
        min: 0, 
        max: 1000,
        required: true
    },
    grading: {
        type: String,
        enum: ['Absolute', 'Relative'],
        required: true,
        default: 'Absolute'
    }
}); 

// To test whether the URL works or not.  


function booleanValidator(value) {
    //You can\'t have Project same as Team Assignment
    if(this.isProject && value) {
        return false; 
    } else {
        return true;
    }
}

assignmentSchema.path('assignmentRepositoryUrl').validate((val) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');

assignmentSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});

module.exports = mongoose.model('Assignment_Project', assignmentSchema);