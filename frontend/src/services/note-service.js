// const BACKEND_URL = "https://make-a-note.onrender.com/"; //use during deployment
const BACKEND_URL = "http://localhost:5000/"; //use during production


export async function fetchNotes()
{
    const token = localStorage.getItem("token");

    const res = await fetch(`${BACKEND_URL}api/notes`,
        {
            headers: {"Authorization": `Bearer ${token}`}
        }
    );

    if(!res.ok)
    {
        throw new Error("Failed to fetch notes from server.");
    }
    return res.json();
};




export async function createNote(note_TDI)
{
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}api/notes`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(
                {
                    title: note_TDI.title || "",
                    description: note_TDI.description || "",
                }
            )
        }
    );
    if(!res.ok)
    {
        throw new Error("Failed to create note on server.");
    }
    return res.json();
};



export async function deleteNote(noteId)
{
    const token = localStorage.getItem("token");

    const res = await fetch(`${BACKEND_URL}api/notes/${noteId}`,
        {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${token}`}
        }
    );
    if(!res.ok)
    {
        throw new Error("Failed to delete note.");
    }
    return res.json();
};



export async function editNote(note)
{
    const token = localStorage.getItem("token");
    
    const res = await fetch(`${BACKEND_URL}api/notes/${note.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(
                {
                    title: note.title,
                    description: note.description
                }
            )
        }
    );
    if(!res.ok)
    {
        throw new Error("Failed to edit note on server.");
    }
    return res.json();

}