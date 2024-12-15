const mongoose = require('mongoose');
const { error, info } = require("../utils/logger");


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        validate: {
            validator: function (v) {
                return v.split(' ').join('').length >= 3;
            },
            message: props => `"${props.value}" is too short a blog name! It must be a name with at least 3 characters.`
        },
        required: [true, 'Blog name is required.']
    },
    author: {
        type: String,
        validate: {
            validator: function (v) {
                return v.split(' ').join('').length >= 3;
            },
            message: props => `"${props.value}" is too short for author name. It must be a name with at least 3 characters.`
        },
        required: [true, 'Blog author is required.']
    },
    url: {
        type: String,
        default: "Not defined."
    },
    likes: {
        type: Number, 
        default: 0
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});


module.exports = mongoose.model(`Blog`, blogSchema);