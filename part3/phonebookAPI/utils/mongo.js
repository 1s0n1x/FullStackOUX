const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give me a password / name / number of Contact as arguments.');
  process.exit(1);
}


const password = process.argv[2];
const nameContact = process.argv[3];
const numberContact = process.argv[4];

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://1s0n1x:${password}@testdb.uh7ic.mongodb.net/test?retryWrites=true&w=majority`);


const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)


if(process.argv.length == 3){
  return Contact.find({})
    .then(data => {
      console.log(`Phonebook:`)
      data.map(e => {
        console.log(`${e.name} ${e.number}`)
      })
      mongoose.connection.close();
    })
} 


const contact = new Contact({
  name: nameContact,
  number: numberContact
})

contact.save().then(result => {
  console.log(`added ${nameContact} number ${numberContact} to phonebook`)
  mongoose.connection.close()
})