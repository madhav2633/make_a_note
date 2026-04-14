const express = require("express");
const router = express.Router();
const connection = require("../database").promise();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "my_super_secret_key";




//login - user verification
router.post('/login', async (req, res) =>
{
    try
    {
        const username = req.body.username;
        const password = req.body.password;

        const [rows] = await connection.query(
            `select user_id, fname, lname, username, password_hash, role
            from users where username = ?`, [username]
        );

        if(rows.length === 0)
        {
            return res.status(400).json({error: "Invalid username or password."});
        }

        const userData = rows[0];

        const isMatch = await bcrypt.compare(password, userData.password_hash);

        if(!isMatch)
        {
            return res.status(400).json({error: "Invalid username or password"});
        }

        const token = jwt.sign(
            {
                userId: userData.user_id,
                username: userData.username,
                role: userData.role,
            }, JWT_SECRET, {expiresIn: "1h"}
        );

        res.status(200).json(
            {
                success: "Login successuful",
                token: token
            }
        );

    }catch(err)
    {
        console.error("Login error:", err);
        res.status(500).json({error: "Server error"});
    }
    
});


//create new user
router.post('/signup', async (req, res) =>
{
    try
    {
        const username = req.body.trimmedUsername;
        const password = req.body.trimmedPassword;

        const [existingUser] = await connection.query(
            `select username from users where username = ?`, [username]
        );

        if(existingUser.length > 0)
        {
            return res.status(400).json({error: "Username already exists."})
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await connection.query(
            `insert into users (username, password_hash)
            values (?, ?)`, [username, hashedPassword]
        );

        if(result.affectedRows === 0)
        {
            return res.status(500).json({error: "Signup failed. Try again."});
        }

        res.status(201).json({success: "Account created successfully",
                                userId: result.insertId
        });
        
    }catch(err)
    {
        console.error("Error creating new account:", err)
        res.status(500).json({error: "Signup failed. Try again."})
    }
})












module.exports = router