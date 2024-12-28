const mongoose = require('mongoose');
const { error, info } = require("../utils/logger");


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        validate: {
            validator: function (v) {
                return v.split(' ').join('').length >= 0;
            },
            message: props => `"${props.value}" is not a valid title! It must contain at least one non-space character.`
        },
        required: [true, 'Blog title is required.']
    },
    author: {
        type: String,
        default: 'Not provided.'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    url: {
        type: String,
        validate: {
            validator: function (v) {
                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
                return urlRegex.test(v);
            },
            message: props => `"${props.value}" is not a valid URL!`
        },
        required: [true, 'Blog URL is required.']
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