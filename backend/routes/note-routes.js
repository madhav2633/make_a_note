const express = require("express");
const router = express.Router();

const {readNoteFile, writeNoteFile} = require("../utils/file-handler");

    //READ
router.get('/', async (req, res) =>
{
    const notes = await readNoteFile();
    res.json(notes);
});


    //CREATE
router.post('/', async (req, res) =>
{   
    try
    {
        const notes = await readNoteFile();
        const {title, description} = req.body; //reieving title and description from user
        const newNote =
            {
                id: Date.now(),
                title: title,
                description: description,       //attaching id and timestamp
                timeStamp: new Date().toLocaleString()
            }
        notes.push(newNote);
        await writeNoteFile(notes);     //writing into the notes.json file 
        res.status(201).json(newNote);  //sending full note to client as confirmation

    }catch(err)
    {
        res.status(500).json({error: "Failed to save note."});
    }
});


    //UPDATE(PUT) NOTE
router.put('/:id', async (req, res) =>
{
    try
    {
        const noteId = Number(req.params.id);
        const {title, description} = req.body;

        const notes = await readNoteFile();
        const noteIndex = notes.findIndex(n => n.id === noteId);

        if(noteIndex === -1)
        {
            return res.status(404).json({error: "Note not found"});
        }
        
        notes[noteIndex] = 
        {
            ...notes[noteIndex],
            title,
            description
        };

        await writeNoteFile(notes);
        res.json(notes[noteIndex]);
    
    }catch(err)
    {
        console.error("Error updating note:", err);
        res.status(500).json({error: "Server error while updating note."});
    }
});


    //DELETE
router.delete('/:id', async (req, res) =>
{
    try
    {
        const id = Number(req.params.id);
        const notes = await readNoteFile();
        const updatedNotes = notes.filter(note => note.id !== id);
        if(updatedNotes.length === notes.length)
        {
            return res.status(404).json({error: "This note was already deleted."});
        }
        await writeNoteFile(updatedNotes);

        res.json({message: "Note deleted successfully."});
    }catch(err)
    {
        res.status(500).json({error: "Failed to delete note."});
    }
});



module.exports = router;

