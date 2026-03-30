import "./NoteCard.css";
import cross_icon from "../assets/cross_icon.png"

export default function NoteCard({note, onDelete, onOpen})
{
    

    return(
        <>
            <div className = "note-card">

                <div className="card-title">
                    {note.title}
                    <div className="title-mask"></div>
                </div>
                <p className="card-description" onClick={onOpen}>
                    {note.description}</p>
                <h6 className="card-date">
                    {note.timeStamp}</h6>
                
                <img src={cross_icon}
                alt="cross_icon"
                className="del-btn"
                onClick= {onDelete}></img>
                
            </div>

            
        </>  

    );
}






