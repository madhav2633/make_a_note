const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'notedb'
    }
);

connection.connect(err =>
{
    if(err)
    {
        console.error("DB connection failed:", err);
    }
    else
    {
        console.log("Connected to MySQL");
    }
});

module.exports = connection;