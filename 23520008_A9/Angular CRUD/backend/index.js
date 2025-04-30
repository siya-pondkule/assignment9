const express = require('express');
// const mysql = require('mysql2');
const {v4: uuidv4} = require('uuid');

const { client, connectToCassandra } = require('./db/cassandra');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const port = 3000;

connectToCassandra();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root', // Change to your MySQL username
//   password: 'Nikita@4105', // Change to your MySQL password
//   database: 'CSE_Companies_db'
// });

// Connect to MySQL
// db.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL database');
// });

// Routes

// Get all companies
// app.get('/companies', (req, res) => {
//   const query = 'SELECT * FROM company';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching companies:', err);
//       return res.status(500).json({ error: 'Failed to fetch companies' });
//     }
//     res.json(results);
//   });
// });




// // Get a single company by ID
// app.get('/companies/:id', (req, res) => {
//   const { id } = req.params;
//   const query = 'SELECT * FROM company WHERE id = ?';
//   db.query(query, [id], (err, results) => {
//     if (err) {
//       console.error('Error fetching company:', err);
//       return res.status(500).json({ error: 'Failed to fetch company' });
//     }
//     res.json(results[0]);
//   });
// });

// // Create a new company
// app.post('/companies', (req, res) => {
//   const { name, location, employee_count, founded_year, industry } = req.body;
//   const query = 'INSERT INTO company (name, location, employee_count, founded_year, industry) VALUES (?, ?, ?, ?, ?)';
//   db.query(query, [name, location, employee_count, founded_year, industry], (err, results) => {
//     if (err) {
//       console.error('Error adding company:', err);
//       return res.status(500).json({ error: 'Failed to add company' });
//     }
//     res.status(201).json({ id: results.insertId, name, location, employee_count, founded_year, industry });
//   });
// });

// // Update a company
// app.put('/companies/:id', (req, res) => {
//   const { id } = req.params;
//   const { name, location, employee_count, founded_year, industry } = req.body;
//   const query = 'UPDATE company SET name = ?, location = ?, employee_count = ?, founded_year = ?, industry = ? WHERE id = ?';
//   db.query(query, [name, location, employee_count, founded_year, industry, id], (err, results) => {
//     if (err) {
//       console.error('Error updating company:', err);
//       return res.status(500).json({ error: 'Failed to update company' });
//     }
//     res.json({ id, name, location, employee_count, founded_year, industry });
//   });
// });

// // Delete a company
// app.delete('/companies/:id', (req, res) => {
//   const { id } = req.params;
//   const query = 'DELETE FROM company WHERE id = ?';
//   db.query(query, [id], (err, results) => {
//     if (err) {
//       console.error('Error deleting company:', err);
//       return res.status(500).json({ error: 'Failed to delete company' });
//     }
//     res.json({ message: 'Company deleted' });
//   });
// });


app.get('/companies', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM companies');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to query Cassandra');
  }
});



// Get a single company by ID
app.get('/companies/:id', async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM companies WHERE id = ?';
  try {
    const result = await client.execute(query, [id], { prepare: true });
    if (result.rowLength === 0) return res.status(404).json({ error: 'Company not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching company:', err);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create a new company
app.post('/companies', async (req, res) => {
  const id = uuidv4();
  const { name, location, employee_count, founded_year, industry } = req.body;
  const query = `
    INSERT INTO companies (id, name, location, employee_count, founded_year, industry)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    await client.execute(query, [id, name, location, employee_count, founded_year, industry], { prepare: true });
    res.status(201).json({ id, name, location, employee_count, founded_year, industry });
  } catch (err) {
    console.error('Error adding company:', err);
    res.status(500).json({ error: 'Failed to add companies' });
  }
});

// Update a company
app.put('/companies/:id', async (req, res) => {
  const id = req.params.id;
  const { name, location, employee_count, founded_year, industry } = req.body;
  const query = `
    UPDATE companies SET name = ?, location = ?, employee_count = ?, founded_year = ?, industry = ?
    WHERE id = ?
  `;
  try {
    await client.execute(query, [name, location, employee_count, founded_year, industry, id], { prepare: true });
    res.json({ id, name, location, employee_count, founded_year, industry });
  } catch (err) {
    console.error('Error updating company:', err);
    res.status(500).json({ error: 'Failed to update companies' });
  }
});

// Delete a company
app.delete('/companies/:id', async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM companies WHERE id = ?';
  try {
    await client.execute(query, [id], { prepare: true });
    res.json({ message: 'Company deleted' });
  } catch (err) {
    console.error('Error deleting company:', err);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});