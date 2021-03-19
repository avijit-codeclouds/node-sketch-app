const { array, string } = require('joi');
const mongoose = require('mongoose');

const DrawSchema = new mongoose.Schema({
    canvas_id: {
        type: String,
        required: true
    },
    shared : {
        type : [String]
    },
    node: {
        type: String    
    },
    owner_id: {
        type: String    
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('draw', DrawSchema);
