const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

morgan.token('reqData', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json());
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'))

let contact = [
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

app.get("/info", (req, res) => {
    let date = new Date(Date.now());
    res.status(200).send(`
    <p>
        Phonebook has info for ${contact.length} people. <br /> 
        <br />
        ${date.toString()}
    </p>    
    `)
});
app.get("/api/persons", (req, res) => {
    return res.status(200).json(contact)
});
app.post("/api/persons", (req, res) => {
    const bodyReq = req.body;
    if(!bodyReq.name || !bodyReq.number) return res.status(400).json({ error: "Name or number is missing. Check your request." });
    if(contact.find((e) => e.name === bodyReq.name)) return res.status(400).json({ error: "The name has already been registered in the phonebook." });

    contact.push({
        id: Math.floor(Math.random() * 4294967295),
        name: bodyReq.name,
        number: bodyReq.number
    })
    res.status(200).json(contact);
});
app.get("/api/persons/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const contactReq = contact.find((c) => c.id === id)
    return res.status(200).json(contactReq);
});
app.delete("/api/persons/:id", (req, res) => {
    const id = parseInt(req.params.id);
    contact = contact.filter((c) => c.id !== id);
    res.status(200).json(contact)
});

app.listen(3000, () => {
    console.log(`Server running on port http://127.0.0.1:3000`)
});