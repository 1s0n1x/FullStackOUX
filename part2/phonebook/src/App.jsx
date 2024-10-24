import React, { useState, useEffect } from 'react';

import notesReq from '../src/services/contacts';
import './App.css';


const Contact = (props) => {
    const { data, removeAction } = props;

    return(
        <tr>
            <td>{data.name}</td>
            <td>{data.number}</td>
            <td><button onClick={() => removeAction(data.id)}>Remove</button></td>
        </tr>
    )
}


const Notification = (props) => {
    const { msgNotif } = props;

    const divStyle = msgNotif.message.split(" ").join("").length == 0
        ? `notification invisible`
        : `notification ${msgNotif.type}`;

    return(
        <div className={divStyle}>
            {msgNotif.message}
        </div>
    )
}

const Filter = (props) => {
    const { updateSearch } = props;

    return (
        <div>
            Filter shown with <input onChange={(e) => updateSearch(e.target.value.toLowerCase())} />
        </div>
    )
}

const PersonForm = (props) => {
    const { handlerSubmit } = props;
    const [ newName, setName ] = useState("");
    const [ newNumber, setNumber ] = useState("");

    const clearHandler = (e) => {
        handlerSubmit(e, newName, newNumber);
        setName("");
        setNumber("");
    }

    return(
        <form onSubmit={clearHandler}>
            <div>name: <input value={newName} onChange={(e) => setName(e.target.value)}/></div>
            <div>number: <input value={newNumber} onChange={(e) => setNumber(e.target.value)}/></div>
            <div><button type="submit">add</button></div>
        </form>
    )
} 

const Persons = (props) => {
    const { searchValue, personsList, removeFunc } = props;

    let arrayDisplay = searchValue.split(" ").join("").length == 0
        ? personsList
        : personsList.filter((a) => a.name.toLowerCase().includes(searchValue));

    return (
        <table>
            <tbody>
                {arrayDisplay.map(a => <Contact key={a.id} data={{ name: a.name, number: a.number, id: a.id }} removeAction={removeFunc} />)}
            </tbody>
        </table>
    )
}


const App = () => {
    const [ notification, setNotification ] = useState({ message: "", type: "log" });
    const [ search, setSearch ] = useState("");
    const [ persons, setPersons ] = useState([]);
    useEffect(() => {
        notesReq.getAllObj()
            .then(e => setPersons(e.data))
            .catch(() => setNotification({ message: "Connection error: Could not get contact information.", type: "error" }));
    }, [])

    const cArr = [ ...persons ];

    const clearNotif = () => {
        setTimeout(() => setNotification({ message: "", type: "log" }), 5000);
    };
    const submitHandler = (e, name, number) => {
        e.preventDefault();

        if(name.split(" ").join("").length == 0 || number.split(" ").join("").length == 0){
            return alert("You can't add a contact without a number/name.");
        }

        let contactExist = cArr.find((e) => e.name === name);
        if(typeof contactExist === "object"){
            let replacewd = window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`);
            if(replacewd === true){
                notesReq.updateObj(contactExist.id, { name: contactExist.name, number: number, id: contactExist.id })
                    .then(() => {
                        setNotification({ message: `${name}'s contact has been modified`, type: "log" })
                        contactExist.number = number;
                        setPersons(cArr);
                    })    
                    .catch(() => setNotification({ message: `Error: Could not update ${name}'s contact information on the server.`, type: "error" }));
            }
            clearNotif();
        } else {
            const newContact = { name: name, number: number, id: `${number}0${number.length + 1}` };
            notesReq.createObj(newContact)
                .then(() => {
                    setNotification({ message: `Added ${name}`, type: "log" })
                    cArr.push(newContact);
                    setPersons(cArr);
                })
                .catch(() => setNotification({ message: `Error: Failed to add ${name} to the server.`, type: "error" }));
            clearNotif();
        }
    };
    const deleteContact = (id) => {
        const contactData = persons.find((e) => e.id == id);
        const wConfirm = window.confirm(`Delete ${contactData.name}?`);

        if(wConfirm === true){
            notesReq.deleteObj(id)
                .then(() => {
                    setNotification({ message: `${contactData.name} was successfully removed from the server`, type: "log" });
                    let newArr = cArr.filter(obj => obj.id !== id);
                    setPersons(newArr);
                })
                .catch(() => setNotification({ message: `Error: Failed to remove ${contactData.name} from the server`, type: "error" }));
            clearNotif();
        }
    };


  return (
    <div>
        <h2>Phonebook</h2>
        <Notification msgNotif={notification} />
        <Filter updateSearch={setSearch} />
        <h3>Add a new...</h3>
        <PersonForm handlerSubmit={submitHandler} />
        <h3>Numbers</h3>
        <Persons searchValue={search} personsList={cArr} removeFunc={deleteContact}/>
    </div>
  )
}

export default App;