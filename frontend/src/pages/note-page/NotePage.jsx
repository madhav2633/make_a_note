import { useState, useEffect } from "react";
import "./NotePage.css";
import NoteWriter from "./NoteWriter";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";
import MessageBox from "../../components/MessageBox";

import { fetchNotes, createNote, editNote, deleteNote } from "../../services/note-service";




export default function NotePage()
{
    const [notes, setNotes] = useState([])
    const [selectedCard, setSelectedCard]= useState(null);
    const [message, setMessage] = useState([]);


    //Notification system
    function showMessage(text, type)
    {
        const msg = 
        {
            id: Date.now(),
            text: text,
            type: type
        }
        setMessage(oldMsg => [...oldMsg, msg]);
        setTimeout(() =>
        {
            setMessage(oldMsg => oldMsg.filter(m => m.id !== msg.id));
        }, 3000)
    };
    

    //Fetching notes from backend GET route
    useEffect(() =>
    {
        async function loadNote()
        {
            try
            {
                const data = await fetchNotes(); //API call function in note-service.js
                setNotes(data);
            }catch(err)
            {
                console.error("Failed to load notes:", err);
                showMessage(err.message || "Loading failed, try again.", "error");
            }
        }
        loadNote();
    }
    , []);
    


    //Note creation using ADD route
    async function noteCreator(noteTD)
    {
        try
        {
            const newNote = await createNote(noteTD);   //recieving note with added (ID and time)
            setNotes(oldNote => [...oldNote, newNote]);
            showMessage("New note added.", "success")
        }catch(err)
        {
            console.error("Failed to add note:", err);
            showMessage(err.message || "Unable to save, try again.", "error");
        }
        
    }


    //Deleting note using DELETE route
    async function noteRemover(id)
    {
        try
        {
            await deleteNote(id); //
            setNotes(oldNote => oldNote.filter(note => note.id !== id))
            showMessage("Note removed", "success")
        }catch(err)
        {
            console.error("Failed to delete note:", err);
            showMessage(err.message || "Unable to delete, try again.", "error");
        }
        
    }


    //Editing note using PUT route
    async function noteEditor(note)
    {
        try
        {
            const updatedNote = await editNote(note);
            setNotes(oldNote => oldNote.map(note => note.id === updatedNote.id ? updatedNote : note))
        }catch(err)
        {
            console.error("Unable to save changes, try again.", err);
            showMessage(err.message || "Unable to save changes, try again.", "error");
        }
        
    };




    
    return(
        
        <div className="note-page">
            <div className="nav-bar">MAKE A NOTE</div>

            <div className="note-writer">
                <NoteWriter onAdd={noteCreator} showMessage={showMessage}/>
            </div>
            
            <div className="note-section">
                {notes
                    .filter(note => note && note.id)
                    .map(note => (<NoteCard key={note.id} note={note}
                    onDelete={() => noteRemover(note.id)}
                    onOpen={() => setSelectedCard(note)}
                    />))}
            </div>
            
            <div className="note-editor">
                {selectedCard && (<NoteEditor
                note = {selectedCard}
                onClose={() => setSelectedCard(null)}
                onSave={noteEditor}
                />) }
            </div>

            <div className="message-container">
                {message.length !== 0 &&
                    message.map(msg => (<MessageBox
                            text={msg.text} type={msg.type} key ={msg.id}/>))    
                }
            </div> 

        </div>
    )
}


