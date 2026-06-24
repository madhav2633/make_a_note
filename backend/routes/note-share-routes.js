const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const connection = require('../database');


//share notes
router.post('/', authMiddleware, async (req, res) =>
{
    try
    {
        const noteId = req.body.noteId;
        const username = req.body.username;
        const ownerUsername = req.user.username;

        if(username === ownerUsername)
        {
            return res.status(400).json({error: "You already have access to this note."});
        }

        const [result] = await connection.query(
            `select user_id from users where username = ?`, [username]
        );

        if(!result[0])
        {
            return res.status(400).json({error: "User does not exist."});
        }

        const userId = result[0].user_id;

        

        const [rows] = await connection.query(
            `insert into note_access (note_id, user_id)
                values (?, ?)`,[noteId, userId]
        );

        if (rows.affectedRows === 0)
        {
            return res.status(500).json({error: "Failed to share, Try again."})
        }

        res.status(200).json({username, success: `Note shared with ${username}`})

    }catch(err)
    {
        console.error("Share note error:", err);
        res.status(500).json({error: "Internal server error"});
    }
});

//show note participants list
router.get('/:noteId', authMiddleware, async (req, res) =>
{
    try
    {
        const noteId = req.params.noteId;

        const [rows] = await connection.query(
            `select users.username from
                users join note_access
                    on users.user_id = note_access.user_id
                        where note_access.note_id = ?`, [noteId]
        );
        const usernames = rows.map(row => row.username);
        res.status(200).json(usernames);

    }catch(err)
    {
        console.error("Participant fetch error:", err);
        res.status(500).json({error: "Internal Server Error"});
    }
    

})


//remove a participant from a note
router.delete('/', authMiddleware, async (req, res) =>
{
    try
    {
        const noteId = req.body.noteId;
        const username = req.body.username;

        const [user] = await connection.query(
            `select user_id from users where username = ?`, [username]
        );
        if (!user[0])
        {
            return res.status(400).json({ error: "User not found" });
        }
        const userId = user[0].user_id;

        await connection.query(
            `delete from note_access where note_id = ? and user_id = ?`, [noteId, userId]
        );

        res.status(200).json({success: `Access removed from ${username}`})
    }catch(err)
    {
        console.error(err);
        res.status(500).json({error: "Internal server error."});
    }
    
});
    


module.exports = router;