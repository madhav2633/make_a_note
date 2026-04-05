const express = require('express');
const router = express.Router();
const connection = require('../database').promise();


//Fetch notes 
router.get('/', async (req, res) =>
{
    try
    {
        
        const userId = Number(req.query.userId);
        const [rows] = await connection.query(
            `select
                note_id as id,
                title, description,
                owner_id as ownerId,
                created_at
                from notes where owner_id = ?`, [userId]
        );
        res.json(rows);
    
    }catch(err)
    {
        console.error("Error fetching notes:", err);
        res.status(500).json({error: 'Failed to fetch notes'});
    }
});


//Create new note using POST
router.post('/', async (req, res) =>
{
    try
    {
        const {title = '', description = '', owner_id} = req.body;
        if(!owner_id)
        {
            return res.status(400).json({error: "owner_id is required"});
        }
        const [result] = await connection.query(
            `insert into notes (title, description, owner_id)
            values (?, ?, ?)`, [title, description, owner_id]
        );

        const [rows] = await connection.query(
            `select note_id as id, title, description, created_at,
            owner_id as ownerId
            from notes where note_id = ?`, [result.insertId]
        );

        if(!rows[0])
        {
            return res.status(500).json({error: "Failed to fetch created note"});
        }

        res.status(200).json(rows[0]);
        

    }catch(err)
    {
        console.error("Error creating note:", err);
        res.status(500).json({error: "Failed to create note"});
    }
});



//Delete a note using DELETE route
router.delete('/:id', async(req, res) =>
{
    try
    {
        const noteId = Number(req.params.id);
        if(!noteId)
        {
            return res.status(400).json({error: "Note ID is required"});
        }

        const [result] = await connection.query(
            `delete from notes where note_id = ?`, [noteId]
        );
        if(result.affectedRows === 0)
        {
            return res.status(404).json({error: "Note not found."});
        }
        res.status(200).json({message: "Note deleted successfully", id: noteId});
    }
    catch(err)
    {
        console.error("Error deleting note:", err);
        res.status(500).json({error: "Failed to delete note."});
    }
});

//Edit a note using PUT route
router.put('/:id', async (req, res) =>
{
    try
    {
        const noteId = Number(req.params.id);
        const {title = '', description = ''} = req.body;
        
        const [result] = await connection.query(
            `update notes
                set title = ?, description = ?
                    where note_id = ?`,
                    [title, description, noteId]
        );

        if(result.affectedRows === 0)
        {
            return res.status(404).json({error: "Note not found."});
        }

        const [rows] = await connection.query(
            `select
                note_id as id, title, description, created_at
                    from notes where note_id = ?`,
                    [noteId]
        );
        res.status(200).json(rows[0]);
    }
    catch(err)
    {
        console.error("Error editing notes:", err);
        res.status(500).json({error: "Failed to edit note."});
    }
})






module.exports = router;