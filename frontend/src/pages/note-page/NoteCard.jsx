import "./NoteCard.css";
import delete_icon from "../../assets/delete_icon.png";


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
                    {note.created_at}</h6>
                <h6>{note.id}</h6>
                <h6>{note.ownerId}</h6>
                <img src={delete_icon}
                alt="cross_icon"
                className="del-btn"
                onClick= {onDelete}></img>
                
            </div>

            
        </>  

    );
}


