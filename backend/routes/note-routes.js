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
        const newNote = req.body;
        notes.push(newNote);
        await writeNoteFile(notes);
        res.status(201).json(newNote);

    }catch(err)
    {
        res.status(500).json({error: "Failed to save note."});
    }
});


    //UPDATE
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
        await writeNoteFile(updatedNotes);

        res.json({message: "Note deleted successfully."});
    }catch(err)
    {
        res.status(500).json({error: "Failed to delete note."});
    }
});



module.exports = router;

