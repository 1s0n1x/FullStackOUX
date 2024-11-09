/* eslint-disable no-unused-vars */
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contacts = require('./models/contacts')


morgan.token('reqData', function (req, _res) { return JSON.stringify(req.body) })
const errorHandler = function (error, _request, response, _next) {
  switch (error.name) {
  case 'CastError':
    response.status(400).json({ message: 'An error occurred. The request ID is malformed, please check and try again.' })
    break
  case 'ValidationError':
    response.status(400).json({ message: Object.keys(error.errors).map((v) => { return error.errors[v].message }) })
    break
  default:
    response.status(500).json({ message: 'The server was unable to correctly process this request.' })
    break
  }
}
const unknownEndpoint = (_req, res) => {
  res.status(404).json({ message: 'Route not found. Please check your request.' })
}

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'))


app.get('/info', (_req, res, next) => {
  let date = new Date(Date.now())

  Contacts.find({})
    .then(data => {
      res.status(200).send(`
                <p>
                    Phonebook has info for ${data.length} people. <br /> 
                    <br />
                    ${date.toString()}
                </p>    
            `)
    })
    .catch(err => next(err))
})
app.get('/api/persons', (_req, res, next) => {
  Contacts.find({})
    .then(data => {
      return res.status(200).json(data)
    })
    .catch(err => next(err))
})
app.post('/api/persons', (req, res, next) => {
  try {
    Contacts.findOne({ name: req.body.name })
      .then(data => {
        if(data) {
          return res.status(302).json({ message: 'This value already exists in the database. You cannot overwrite it this way.' })
        } else {
          let nContact = new Contacts({ name: req.body.name, number: req.body.number })
          let errValidate = nContact.validateSync()

          if(!errValidate) {
            nContact.save().then(() => {
              Contacts.find({})
                .then(dataF => {
                  return res.status(200).json(dataF)
                })
            })
          } else {
            next(errValidate)
          }
        }
      })
  } catch (error) {
    next(error)
  }
})
app.get('/api/persons/:idorname', (req, res, next) => {
  if(!req.params.idorname) return res.status(400).json({ message: 'This request cannot be processed if the ID is missing.' })

  try {
    if (req.params.idorname.match(/^[0-9a-fA-F]{24}$/)) {
      return Contacts.findOne({ _id: req.params.idorname })
        .then(data => {
          if(!data) {
            return res.status(404).json('This ID could not be found in the database. Please check and try again.')
          } else {
            return res.status(200).json(data)
          }
        })
    } else {
      return Contacts.findOne({ name: req.params.idorname })
        .then(data => {
          if(!data) {
            return res.status(404).json({ message: 'This name could not be found in the database. Please check and try again.' })
          } else {
            return res.status(200).json(data)
          }
        })
    }
  } catch (error) {
    next(error)
  }
})
app.put('/api/persons/:id', (req, res, next) => {
  if(!req.params.id) return res.status(400).json({ message: 'This request cannot be processed if the ID is missing.' })

  try {
    return Contacts.findOne({ _id: req.params.id })
      .then(data => {
        if(!data) {
          return res.status(404).json({ message: 'This ID could not be found in the database. Please check and try again.' })
        } else {
          Contacts.findByIdAndUpdate(
            req.params.id, { number: req.body.number },
            { new: true, runValidators: true, context: 'query' }
          )
            .then(() => {
              Contacts.find({})
                .then(tData => {
                  return res.status(200).json(tData)
                })
            }, err => {
              next(err)
            })
        }
      })
  } catch (error) {
    next(error)
  }
})
app.delete('/api/persons/:id', (req, res, next) => {
  if(!req.params.id) return res.status(400).json({ message: 'This request cannot be processed if the id is missing.' })

  try {
    Contacts.findOne({ _id: req.params.id })
      .then(data => {
        if(!data){
          return res.status(410).json({ message: 'Inaccessible item. Cannot be deleted if not found in the database' })
        } else {
          return Contacts.findOneAndDelete({ _id: data.id })
            .then(() => {
              Contacts.find({})
                .then(gData => {
                  return res.status(200).json(gData)
                })
            })
        }
      })
  } catch (error) {
    next(error)
  }
})
app.use(unknownEndpoint)
app.use(errorHandler)


app.listen(3000, () => {
  console.log('Server running on port http://127.0.0.1:3000')
})