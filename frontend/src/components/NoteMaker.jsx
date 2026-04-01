import "./NoteMaker.css";
import {useEffect, useState} from "react";
import NoteCard from "./NoteCard";
import MessageBox from "./MessageBox";
import NoteEditor from "./NoteEditor";

import {deleteNote, createNote, fetchNotes, editNote} from "../services/note-service";




export default function NoteMaker()
{
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState([]);
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState(null);

    //this part handles alert notifications
    const alerts =
    {
        noteCreated: "Success: New note created.",
        noteDeleted: "Deleted: Note removed.",
        emptyNote: "Failed: Cannot create empty note.",
        serverErrorSaver: "Server error: Could not save note.",
        serverErrorDeleter: "Server error: Could not delete.",
        serverErrorUpdater: "Server error: Could not update note.",
        serverErrorNoteLoader: "Server error: Could not load notes."
    }
    const alertHandler = (alertType) =>
    {
        const newMsg = {id: Date.now(), msg: alertType}
        setMessage(old => [newMsg, ...old]);

        setTimeout(() =>
        {
            setMessage(old => old.filter(msg => msg.id !== newMsg.id));
        }, 3000);
    }


    //this part fetches data from the backend get route (API call)
    useEffect(() =>
        {
        const loadNotes = async () =>
        {
            try
            {
                const data = await fetchNotes();    //fetchNote(API call) function is in note-service.js
                setNotes(data);
                //fake loading notes message
                setTimeout(() =>
                {
                    setLoading(false);
                }, 1500);
            }
            catch(err)
            {
                alertHandler(alerts.serverErrorNoteLoader);
                console.error(err);
                setLoading(false);
            };
            
        };
        loadNotes();
    }, []);
                

    // this part handles note creation (API call)
    const noteHandler = async () =>
    {
        //input validations
        if(!description.trim())
        {
            alertHandler(alerts.emptyNote);
            return;
        }
        const newNote =
        {
            title: title.trim() || "untitled",
            description: description.trim()
        };

        //adding new note through backend using post route
        try
        {
            const savedNote = await createNote(newNote); //createNote(API call) function is in note-service.js
            setNotes(old => [...old, savedNote]);

            setTitle("");
            setDescription("");
        
        }catch(err)
        {
            console.error(err);
            alertHandler(alerts.serverErrorSaver);
        }
 
    };


    //this part handles note deletion process
    const deleteHandler = async (id) =>
    {
        try
        {
            await deleteNote(id); //deleteNote(API call) function is in note-service.js

            setNotes(old => old.filter(note => note.id !== id));
            alertHandler(alerts.noteDeleted);

        }catch(err)
        {
            console.error(err);
            alertHandler(err.message || alerts.serverErrorDeleter);
        }
    };




    //this part updates the note into the server using PUT route
    const updateHandler = async (editedNote) =>
    {
        try
        {
            const savedNote = await editNote(editedNote);   //editNote(API call) function is in note-service.js

            setNotes(oldNotes => oldNotes.map(note => note.id === savedNote.id ? savedNote : note))
            
        }catch(err)
        {
            console.error(err);
            alertHandler(alerts.serverErrorUpdater);
        };
    };
    



    



    return (
        <>  <div className="nav-bar">MAKE A NOTE</div>
        
            <div className = "note-maker">
                <input
                    type = "text"
                    className = "title-box"
                    placeholder = "Title"
                    value = {title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                
                <textarea
                    className = "description-box"
                    placeholder = "Description"
                    value = {description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <button
                    className = "add-btn"
                    onClick={noteHandler}
                    >Add Note</button>
            </div>

            <div className = "note-section">
                {
                    loading
                    ?
                    (<div className="notes-loading">
                        <div className="loader"></div>
                        <p>Loading</p>
                    </div>)
                    :
                    (notes.length === 0 
                    ?
                        <div className="no-notes">
                            <div className="empty-note-eyes"
                            />
                            <p>Soon this place will be full of ideas, poems or grocery list.</p>
                        </div>
                    :
                        (notes
                            .filter(note => note && note.id)
                            .map(note => <NoteCard note = {note} key = {note.id}
                        onDelete = {() => deleteHandler(note.id)} 
                        onOpen = {() => setSelectedNote(note)}
                        />)))
                    }
            </div>
                    {message.length !== 0
                    ?
                        <div className="message-container">
                            { message.map(msg => <MessageBox msg = {msg} key = {msg.id} />)}
                        </div>
                    : ""
                    }

                    {selectedNote && (<NoteEditor onClose = {() => setSelectedNote(null)}
                        note = {selectedNote}   onSave = {updateHandler}
                    /> )}
        </>
    );
};


