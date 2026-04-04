import "./NoteEditor.css";
import { useState } from "react";

export default function NoteEditor({onClose, note, onSave})
{

    const [title, setTitle] = useState(note.title || "");
    const [description, setDescription] = useState(note.description || "");


    const saveAndClose = () =>
    {
        const editedTitle = title.trim() === "" ? "untitled" : title.trim();
        const editedData = 
        {
            ...note,
            title: editedTitle,
            description: description.trim()
        }

        onSave(editedData);
        onClose();
        
        
    }



    return (

            <div className="editor-overlay" onClick={saveAndClose}>

                <div className="note-editor-box" onClick={(e) => e.stopPropagation()}>
                    <input className="title-editor"
                        value = {title}
                        onChange = {(e) => {setTitle(e.target.value)}}
                    />
                        
                    
                    <textarea className="description-editor" 
                        value = {description}
                        onChange = {(e) => {setDescription(e.target.value)}}
                    />
                    
                    <p className="time">Created at: {note.timeStamp}</p>

                </div>

            </div>


    )
}