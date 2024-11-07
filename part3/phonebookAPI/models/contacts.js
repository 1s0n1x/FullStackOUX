const mongoose = require('mongoose')
require('dotenv').config();

const url = process.env.MONGODB_URI;
console.log('connecting to', url);

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error connecting to MongoDB:', error.message))

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator: function (v) {
        return v.split(" ").join("").length >= 3
      },
      message: props => `${props.value} is too short a contact name! It must be a name with at least 3 characters.`
    },
    required: [true, `Contact name is required.`]
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{5,}$/.test(v);
      },
      message: props => `${props.value} is not a valid contact number!`
    },
    required: [true, `Contact number is required.`]
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)
