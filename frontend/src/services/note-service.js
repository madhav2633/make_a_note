const BACKEND_URL = "https://make-a-note.onrender.com/"; //use during deployment
// const BACKEND_URL = "http://localhost:5000/"; //use during production


//GET route to load notes
export async function fetchNotes()
{
    const res = await fetch(`${BACKEND_URL}api/notes`);
    if(!res.ok)
    {
        throw new Error("Failed to fetch notes from server.");
    }
    return res.json();
};


//POST API call to create notes
export async function createNote(noteTD)
{
    const res = await fetch(`${BACKEND_URL}api/notes`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(noteTD)    //sending title and description to server
        }
    );
    if(!res.ok)
    {
        throw new Error("Failed to create note on server.");
    }
    return res.json(); //recieving id,title,description, timestamp
      
};

//DELETE API call delete notes
export async function deleteNote(id)
{
    const res = await fetch(`${BACKEND_URL}api/notes/${id}`,
        {method: "DELETE"}
    );
    const data = await res.json(); //to read the error or success message inside res
    if(!res.ok)
    {
        throw new Error(data.error || "Failed to delete note.");
    }
    return data;
};

//PUT API call to edit/update notes
export async function editNote(modifiedNote)
{
    const res = await fetch(`${BACKEND_URL}api/notes/${modifiedNote.id}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(modifiedNote)
        }
    );
    const savedNote = await res.json();

    if(!res.ok)
    {
        throw new Error(savedNote.error || "Unable to edit note.");
    }
    return savedNote;
}
