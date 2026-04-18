import { useState, useEffect } from "react";
import "./NotePage.css";
import NoteWriter from "./NoteWriter";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";
import MessageBox from "../../components/MessageBox";
import { useNavigate} from "react-router-dom";
import user_img from "../../assets/user_img.png";

import { fetchNotes, createNote, deleteNote, editNote} from "../../services/note-service";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;




export default function NotePage()
{
    const [notes, setNotes] = useState([])
    const [selectedCard, setSelectedCard]= useState(null);
    const [message, setMessage] = useState([]);
    const [dropdown, setDropdown] = useState(false);

    const navigate = useNavigate();

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
        
        setTimeout(() => {loadNote()}, 2000)
    }
    , []);
    


    //Note creation using ADD route
    async function noteCreator(noteTD)
    {
        try
        {
            const newNote = await createNote(noteTD);
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
            await deleteNote(id);
            setNotes(old => old.filter(note => note.id !== id));
            showMessage("Note removed.", "success");
        }
        catch(err)
        {
            showMessage(err.message || "Unable to delete, try again", "error");
        }
    }

    //Editing a note using PUT route
    async function noteEditor(note)
    {
        try
        {
            const newNote = await editNote(note);
            setNotes(old => old.map(note => note.id === newNote.id ? newNote : note));
        }
        catch(err)
        {
            console.error("Unable to save changes:", err);
            showMessage(err.message || "Unable to save changes, try again.", "error");
        }
        
    }

    

    async function logoutHandler()
    {
        try
        {
            await fetch(`${BACKEND_URL}api/users/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );
            navigate("/login");
        
        }catch(err)
        {
            console.error("Logout failed:", err);
        }
        
    }

    
    return(
        
        <div className="note-page">
            <div className="nav-bar">
                <div className="nav-left"></div>
                <div className="nav-mid">MAKE A NOTE</div>
                <div className="nav-right"> 
                    <img src={user_img} alt="user_image" className="user-img"
                        onClick={() => setDropdown(prev => !prev)}
                    ></img>
                {dropdown && (
                    <div className="dropdown-menu">
                        <div className="dropdown-item">Edit profile</div>
                        <div className="dropdown-item"
                            onClick={logoutHandler}
                        >Logout</div>
                    </div>
                    )}
                </div>
            </div>
            <br/>

            <div className="note-writer">
                <NoteWriter onAdd={noteCreator} showMessage={showMessage}/>
            </div>

            {!notes.length && 
                <div className="no-notes">
                    <div className="loader"></div>
                    <p>One day this place will be full of ideas, poetry and grocery list... or people you want to slap.</p>
                </div>
            }
            
            
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


