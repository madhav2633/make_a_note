import "./NoteMaker.css";
import {useEffect, useState} from "react";
import NoteCard from "./NoteCard";
import MessageBox from "./MessageBox";
import NoteEditor from "./NoteEditor";




export default function NoteMaker()
{
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState([]);
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState(null);

    const BACKEND_URL = "https://make-notes-y62j.onrender.com/";
    

    //this part handles alert notifications
    const alerts =
    {
        noteCreated: "Success: New note created.",
        noteDeleted: "Deleted: Note removed.",
        emptyNote: "Failed: Cannot create empty note.",
        serverErrorSaver: "Server error: Could not save note.",
        serverErrorDeleter: "Server error: Could not delete.",
        serverErrorUpdater: "Server error: Could not update note."
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



    // this part handles note creation
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
            id: Date.now(),
            title: title.trim() || "untitled",
            description: description.trim(),
            timeStamp: new Date().toLocaleString()
        };

        //adding new note through backend using post route
        try
        {
            const res = await fetch(`${BACKEND_URL}api/notes`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newNote)
            });
            
            const savedNote = await res.json();
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
    const deleteNote = async (id) =>
    {
        try
        {
            const res = await fetch(`${BACKEND_URL}api/notes/${id}`,
                {method: "DELETE"}
            );
            if(res.ok)
            {
                setNotes(old => old.filter(note => note.id !== id));
                 alertHandler(alerts.noteDeleted);
            }
            else
            {
                alertHandler(alerts.serverErrorDeleter);
                throw new Error("Failed to delete note."); 
            };

        }catch(err)
        {
            console.error(err);
            alertHandler(alerts.serverErrorDeleter);
        }


    }


    //this part fetches data from the backend get route
    useEffect(() => {
        const fetchNotes = async () =>
        {
            try
            {
                const res = await fetch(`${BACKEND_URL}api/notes`);
                const data = await res.json();
                setNotes(data);

                //fake loading notes message
                setTimeout(() =>
                    {
                        setLoading(false);
                    }, 1500);

            }catch(err)
            {
                console.log(err);
            }
        };

        fetchNotes();

    }, []);


    //this part updates the note into the server using PUT route
    const updateNote = async (editedNote) =>
    {
        try
        {
            const res = await fetch(`${BACKEND_URL}api/notes/${editedNote.id}`,
                {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(editedNote)
                });

            if(!res.ok)
            {
                alertHandler(alerts.serverErrorUpdater);
                throw new Error("Failed to update note on server.");
            };
            
            const savedNote = await res.json();

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
                        (notes.map(note => <NoteCard note = {note} key = {note.id}
                        onDelete = {() => deleteNote(note.id)} 
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
                        note = {selectedNote}   onSave = {updateNote}
                    /> )}
        </>
    );
};


