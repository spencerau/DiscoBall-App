// backend/app.js

// chatgpt code 
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  //TODO: use an .env to load password
  password: 'Hola1234', // Enter your MySQL password here
  port:3000,
  database: 'CelebratoryTech'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Execute SQL query
connection.query('SELECT * FROM your_table', (err, results, fields) => {
  if (err) {
    console.error('Error executing query: ' + err.stack);
    return;
  }
  console.log('Query results:', results);
});

// Close the connection
connection.end();

// how to get the database entries if working through node (example)
app.get('/Responses', (req, res) => {
    connection.query('SELECT * FROM Responses WHERE Question1 LIKE ?', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
  });

// example of POST method to add information to the database
app.post("/Responses", jsonParser, function (req, res) {
    var userID = req.body.id;
    var question1 = req.body.q1;
    var question2 = req.body.q2;
    connection.query("INSERT INTO Responses (userID,question1,question2) VALUES (?,?,?)", [id, q1, q2], function (error, results, fields) {
        if (error)
            throw error;
        res.send(JSON.stringify({ "message": true, "result": results }));
    });
});

// can copy the get method to get certain entries from the database (where certain questions are equal, etc)