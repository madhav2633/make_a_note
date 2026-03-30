const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;

app.use(cors());
app.use(express.json());

const notesRouter = require("./routes/note-routes");


app.use("/api/notes", notesRouter);



app.listen(PORT, () => {
    console.log(`Server is running of localhost:${5000}`);
})

