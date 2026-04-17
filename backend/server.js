require("dotenv").config();

if(!process.env.JWT_SECRET)
{
    console.error("JWT_SECRET is missing in .env");
    process.exit(1);
}

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(express.json());
app.use(cookieParser());

const notesRouter = require("./routes/db-routes")
const usersRouter = require("./routes/users-routes")


app.use("/api/notes", notesRouter);

app.use("/api/users", usersRouter);




app.listen(PORT, () => {
    console.log("PORT VALUE:", PORT);
})

