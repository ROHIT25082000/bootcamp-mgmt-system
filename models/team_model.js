const mongoose = require('mongoose'); 
/**
 * We specify the schema of Team 
 * - project_id <ref> to Assignments
 */
const team_schema = mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment_Project',
        required: true
    }
});

module.exports = mongoose.model('Team', team_schema); 