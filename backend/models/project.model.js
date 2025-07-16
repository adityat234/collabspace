import mongoose from 'mongoose';

// creating the project schema
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: [true, 'Project name must be unique'],
    },

    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    fileTree: {
        type: Object,
        default: {}
    },

})


// converting the projectSchema into a model
const Project = mongoose.model('Project', projectSchema)

// exporting the model
export default Project;