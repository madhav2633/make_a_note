import { useState } from "react";
import "./NoteWriter.css";

export default function NoteWriter ({onAdd, showMessage})
{
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    async function noteInput()
    {
        if(!description.trim())
        {
            showMessage("Can't leave description empty.", "error")
            return;
        }
        const noteTD = 
        {
            title: title.trim() || "untitled",
            description: description.trim()
        };

        onAdd(noteTD);
        setTitle("");
        setDescription("");
    }




    return(
        <>
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
                    onClick={noteInput}
                    >Add Note</button>
        </>

    )
}