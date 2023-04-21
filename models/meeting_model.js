const mongoose = require('mongoose');
/**
 * We specify the schema of the Meetings 
 * -zoomlink
 * -meetTitle
 * -meetDescription
 * -startTime
 * -endTime
 * -isRecorded
 * 
 */
const meetSchema = mongoose.Schema({
    zoomlink: {
        type: String, 
        required: true,
        unique: true
    }, 
    meetTitle: {
        type: String,
        required: true
    }, 
    meetDescription: {
        type: String,
        default: "Bootcamp Session"
    },
    startTime: {
        type: Date, 
    },
    endTime: {
        type: Date, 
    },
    isRecorded: {
        type: Boolean, 
        required: true,
        default: true
    }
}); 

meetSchema.path('zoomlink').validate((val) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL. for zoom');

module.exports = mongoose.model('Meet', meetSchema);