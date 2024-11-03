const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contacts = require("./models/contacts");


morgan.token('reqData', function (req, res) { return JSON.stringify(req.body) })
const errorHandler = (error, request, response, next) => {
    console.error(error);
    return response.status(500).json({ error: "The server was unable to correctly process this request." })
};
const unknownEndpoint = (req, res) => {
    res.status(404).json({ message: "Route not found. Please check your request." })
};

const app = express();

app.use(express.json());
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'))

/* Old Data - API
let contact2 = [
    {
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
];
*/

app.get("/info", (req, res, next) => {
    let date = new Date(Date.now());

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
        .catch(() => next())
});
app.get("/api/persons", (req, res, next) => {
    Contacts.find({})
        .then(data => {
            return res.status(200).json(data);
        })
        .catch(err => next())
});
app.post("/api/persons", (req, res, next) => {
    if(!req.body.name || !req.body.number) return res.status(400).json({ message: "This request cannot be processed if the name or number is missing." })

    Contacts.find({ name: req.body.name })
        .then(data => {
            if(data.length > 0) return res.status(302).json({ message: "This value already exists in the database. You cannot overwrite it this way." });
            
            let nContact = new Contacts({ name: req.body.name, number: req.body.number });
            nContact.save().then(() => {
                Contacts.find({})
                    .then(data => {
                        return res.status(200).json(data);
                    })
                    .catch(() => next())
            })
            .catch(() => next())
        })
        .catch(() => next())
});
app.get("/api/persons/:id", (req, res, next) => {
    if(!req.params.id) return res.status(400).json({ message: "This request cannot be processed if the ID is missing." })
    Contacts.findOne({ _id: req.params.id })
        .then(data => {
            if(!data) return res.status(404).json("This ID could not be found in the database. Please check and try again.");
            return res.status(200).json(data)
        }).catch(() => next())
});
app.get("/api/persons/:name", (req, res, next) => {
    if(!req.params.name) return res.status(400).json({ message: "This request cannot be processed if the name is missing." })
    Contacts.findOne({ name: req.params.name })
        .then(data => {
            if(!data) return res.status(404).json({ message: "This name could not be found in the database. Please check and try again." })
            return res.status(200).json(data);
        })
        .catch(() => next());
});
app.put("/api/persons/:id", (req, res, next) => {
    if(!req.params.id) return res.status(400).json({ message: "This request cannot be processed if the ID is missing." });

    Contacts.findOne({ _id: req.params.id })
        .then(data  => {
            if(!data) return res.status(404).json({ message: "This ID could not be found in the database. Please check and try again." });
            Contacts.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name, number: req.body.number })
                .then(() => {
                    Contacts.find({})
                        .then(tData => {
                            return res.status(200).json(tData);
                        })
                        .catch(() => next());
                })
                .catch(() => next());
        })
        .catch(() => next())
});
app.delete("/api/persons/:id", (req, res, next) => {
    if(!req.params.id) return res.status(400).json({ message: "This request cannot be processed if the id is missing." })

    Contacts.findOne({ _id: req.params.id })
        .then(data => {
            if(!data) return res.status(410).json({ message: "Inaccessible item. Cannot be deleted if not found in the database" })
        })

    Contacts.findByIdAndDelete(req.params.id)
        .then(() => {
            Contacts.find({})
                .then(data => {
                    return res.status(200).json(data)
                })
                .catch(() => next())
        })
        .catch(() => next())
});
app.use(unknownEndpoint);
app.use(errorHandler);


app.listen(3000, () => {
    console.log(`Server running on port http://127.0.0.1:3000`)
});