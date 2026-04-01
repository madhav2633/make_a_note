import "./NoteEditor.css";
import { useState } from "react";

export default function NoteEditor({onClose, note, onSave})
{

    const [title, setTitle] = useState(note.title || "");
    const [description, setDescription] = useState(note.description || "");


    const saveEditedNote = () =>
    {
        const editedTitle = title.trim() === "" ? "untitled" : title.trim();
        const editedNote = 
        {
            ...note,
            title: editedTitle,
            description: description.trim()
        }
        
        onSave(editedNote);
        onClose();
    }



    return (

            <div className="editor-overlay" onClick={saveEditedNote}>

                <div className="note-editor" onClick={(e) => e.stopPropagation()}>
                    <input className="title-editor"
                        value = {title}
                        onChange = {(e) => {setTitle(e.target.value)}}
                    />
                        
                    
                    <textarea className="description-editor" 
                        value = {description}
                        onChange = {(e) => {setDescription(e.target.value)}}
                    />
                    
                    <p className="time">Created at: 2024/05/21 17:42</p>

                </div>

            </div>


    )
}