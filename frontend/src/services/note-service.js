const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export async function fetchNotes()
{

    const res = await fetch(`${BACKEND_URL}api/notes`,
        {
            credentials: "include"
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
    const res = await fetch(`${BACKEND_URL}api/notes`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
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
            credentials: "include"
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
            },
            credentials: "include",
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