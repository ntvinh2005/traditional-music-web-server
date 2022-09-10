const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    lessons: {
        type: Array,
        required: true
    },
    learners: {
        type: Array, 
        required: true
    },
    createdAt: {
        type: Date,  
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = mongoose.model('courses', CourseSchema)