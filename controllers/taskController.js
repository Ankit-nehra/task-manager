const Task = require('../models/taskModel');

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = await Task.create({ title, description });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('❌ Error creating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const filter = {};

    // Filter by completed if provided
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }

    // Filter by title if provided
    if (req.query.title) {
      filter.title = { $regex: new RegExp(req.query.title, 'i') }; // case-insensitive
    }

    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
