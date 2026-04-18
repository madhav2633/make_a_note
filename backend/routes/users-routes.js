const express = require("express");
const router = express.Router();
const connection = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");


const JWT_SECRET = process.env.JWT_SECRET;


//route to check if user is logged in so redirecting page can work 
router.get("/me", authMiddleware, (req, res) =>
{
    res.json({user: req.user});
});

//logout
router.post("/logout", (req, res) =>
{
    res.clearCookie("token");
    res.json({message: "Logged out"});
});


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
            }, JWT_SECRET, {expiresIn: "7d"}
        );

        res.cookie("token", token,
            {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        )

        res.status(200).json(
            {
                success: "Login successuful",
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