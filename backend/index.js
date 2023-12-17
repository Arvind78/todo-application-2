const express = require("express");
const cors = require("cors");
const mysql = require('mysql');
const dotenv = require("dotenv").config();

const app = express();
app.use(cors());

// Initialize Node-persist
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"todos"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// Create a 'todo' table
const createTodoTable = `
  CREATE TABLE IF NOT EXISTS todo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255) NOT NULL
  )
`;

con.query(createTodoTable, (err, results) => {
  if (err) {
    console.error('Error creating todo table:', err);
    throw err;
  }
  console.log('Todo table created or already exists');
});

app.use(express.json());

  

// Get all todos
app.get('/todos', (req, res) => {
  con.query('SELECT * FROM todo', (err, results) => {
    if (err) {
      console.error('Error getting todos:', err);
      res.status(500).json({ error: 'Error getting todos' });
      return;
    }
    res.json(results);
  });
});

// Create a new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) {
    res.status(400).json({ error: 'Task field is required' });
    return;
  }

  con.query('INSERT INTO todo (task) VALUES (?)', [task], (err, results) => {
    if (err) {
      console.error('Error creating todo:', err);
      res.status(500).json({ error: 'Error creating todo' });
      return;
    }
    res.status(201).json({ message: 'Todo created successfully', id: results.insertId });
  });
});


// Delete a todo by ID
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;

  con.query('DELETE FROM todo WHERE id = ?', [todoId], (err, results) => {
    if (err) {
      console.error('Error deleting todo:', err);
      res.status(500).json({ error: 'Error deleting todo' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json({ message: 'Todo deleted successfully' });
  });
});


app.listen(process.env.PORT || 8080, () => {
  console.log(`Server Running ${process.env.PORT || 8080}`);
});


