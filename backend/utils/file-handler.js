const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, '..', 'note-directory', 'notes.json');



const readNoteFile = async () =>
{
    try
    {
        const notes = await fs.readFile(filePath, 'utf-8');
        return notes ? JSON.parse(notes) : [];


    }catch(err)
    {
        console.log("Error reading notes:", err);
        return [];
    }
};

const writeNoteFile = async (notes) =>
{
    try
    {
        await fs.writeFile(filePath, JSON.stringify(notes, null, 4));

    }catch(err)
    {
        console.error("Error writing into notes file: ", err);
        throw new Error("Failed to save notes.");
    }
};

module.exports = {readNoteFile, writeNoteFile};


