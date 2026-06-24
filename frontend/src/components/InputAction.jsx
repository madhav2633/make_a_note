import { useState, useEffect } from "react";
import "./InputAction.css"
import close_icon from "../../src/assets/close_icon.svg";
import delete_icon from "../../src/assets/delete_icon.svg"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function InputAction({onCross, note, showMessage, loadParticipants})
{
    const [username, setUsername] = useState("");
    const [sharedUsers, setSharedUsers] = useState([]);


    //share note with others
    async function shareNote()
    {
        try
        {
            if(!username.trim())
            {
                showMessage("Please enter a valid username", "error");
                return;
            }
            const noteId = note.id;
            const data = {noteId, username};

            const res = await fetch(`${BACKEND_URL}api/notes/share`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data),
                    credentials: "include"
                }
            );

            const result = await res.json();

            if(!res.ok)
            {
                showMessage(result.error, "error");
                return;
            }
            showMessage(result.success, "success");
            loadModalParticipants();
            loadParticipants(note.id);
        }catch(err)
        {
            console.error(err);
            showMessage("Something went wrong", "error");
        }

    }

    //function to load list of participants of a note
    async function loadModalParticipants()
    {
        try
        {
            const res = await fetch(`${BACKEND_URL}api/notes/share/${note.id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const data = await res.json();
            
            if(res.ok)
            {
                setSharedUsers(data);
            }
        }catch(err)
        {
            console.error(err);
        }
    }
    useEffect(() =>
    {
        if(!note?.id) return;
        loadModalParticipants();
    },[note])

        
    //remove participants from a note
    async function removeParticipants(user)
    {
        try
        {
            const noteId = note.id;
            const username = user;
            const data = {noteId, username};

            const res = await fetch(`${BACKEND_URL}api/notes/share`,
                {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data),
                    credentials: "include"
                }
            );

            const result = await res.json();
            if(!res.ok)
            {
                showMessage(result.error, "error");
                return;
            }

            showMessage(result.success, "success");
            
            await loadModalParticipants();
            await loadParticipants(note.id);
        }catch(err)
        {
            console.error(err);
            showMessage("Something went wrong", "error");        
        }
    }




    return(
        <div className="share-overlay">
                <div className="share-with-modal">

                    <img src={close_icon} className="close-icon"
                        onClick={onCross}
                    ></img>

                    <p className="heading">Share with</p>

                    <div className="action-wrap">
                        <input className="share-input"
                            placeholder="Enter username"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        ></input>

                        <button className="share-btn"
                            onClick={shareNote}
                        >Share</button>
                    </div>

                    <div className="shared-with-section">
                        <p className="access-heading">Who has access</p>

                    {sharedUsers.length === 0 ? <p className="no-participants">No participants yet</p> :
                        sharedUsers.map((users) =>
                        <div className="user-list" key = {users}>
                            <p className="user-name">{users}</p>
                            <img className="remove-btn"
                                src={delete_icon}
                                onClick={() => removeParticipants(users)}
                            ></img>
                        </div>
                        )}
                    </div>

                </div>
            </div>
    )
}