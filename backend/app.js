// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb://127.0.0.1:27017/tasktracker'; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Task model
const Task = mongoose.model('Task', new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
}));

// Create a new task
app.post('/tasks', async (req, res) => {
    const { title, description, dueDate, status } = req.body;
    console.log(req.body)
    // Basic validation for incoming data
    if (!title || !description || !dueDate) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newTask = new Task({ title, description, dueDate, status });

    try {
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
        console.log("data is stored")
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log("data is not stored")
    }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
