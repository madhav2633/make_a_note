// const BACKEND_URL = "https://make-a-note.onrender.com/"; //use during deployment
const BACKEND_URL = "http://localhost:5000/"; //use during production


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
export async function createNote(note)
{
    const res = await fetch(`${BACKEND_URL}api/notes`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(note)
        }
    );
    if(!res.ok)
    {
        throw new Error("Failed to create note on server.");
    }
    return res.json();
      
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

//PUT API call to edit notes
export async function editNote(editedNote)
{
    const res = await fetch(`${BACKEND_URL}api/notes/${editedNote.id}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(editedNote)
        }
    );
    const savedNote = await res.json();

    if(!res.ok)
    {
        throw new Error(savedNote.error || "Unable to edit note.");
    }
    return savedNote;
}