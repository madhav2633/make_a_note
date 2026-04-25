import "./NoteCard.css";
import delete_icon from "../../assets/delete_icon.png";
import share_icon from "../../assets/share_icon.svg";


export default function NoteCard({note, onDelete, onOpen, openShareOption, sharedUsers})
{
    const formattedDate = new Date(note.created_at).toLocaleString([],
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }
    )

    const userInitials = sharedUsers.slice(0, 3).map(user => user?.[0]?.toUpperCase() || "?");




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
                    {formattedDate}</h6>
                <img src={delete_icon}
                    alt="cross_icon"
                    className="del-btn"
                    onClick= {onDelete}></img>

                <div className="share-option">
                    <img src={share_icon}
                        alt="share_icon"
                        className="share_icon"
                        onClick={openShareOption}
                    />
                    
                    {userInitials.map((letter, index) =>
                    (<div className="shared-to-icon"
                    key={index}
                    onClick={openShareOption}>
                        <p>{letter}</p>
                    </div>))}   
                </div>

                <div className="owner-icon"> 
                    <p>A</p>
                </div>

            </div>            
        </>  

    );
}


