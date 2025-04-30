const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://prajakta:dbPrajakta@cluster0.deia9.mongodb.net/companies",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});

// Define Company Schema
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  employee_count: { type: Number, required: true },
  founded_year: { type: Number, required: true },
  industry: { type: String, required: true }
});

const Company = mongoose.model('Company', companySchema);

// Routes

// Get all companies
app.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get a single company by ID
app.get('/companies/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (err) {
    console.error('Error fetching company:', err);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create a new company
app.post('/companies', async (req, res) => {
  try {
    const { name, location, employee_count, founded_year, industry } = req.body;
    const company = new Company({ name, location, employee_count, founded_year, industry });
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    console.error('Error adding company:', err);
    res.status(500).json({ error: 'Failed to add company' });
  }
});

// Update a company
app.put('/companies/:id', async (req, res) => {
  try {
    const { name, location, employee_count, founded_year, industry } = req.body;
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { name, location, employee_count, founded_year, industry },
      { new: true }
    );
    if (!updatedCompany) return res.status(404).json({ error: 'Company not found' });
    res.json(updatedCompany);
  } catch (err) {
    console.error('Error updating company:', err);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete a company
app.delete('/companies/:id', async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) return res.status(404).json({ error: 'Company not found' });
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