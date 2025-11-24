require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const logRequest = require("./loggers");
// const validate = require(".validator.js");
const Todo = require(".models/todo.model.js")
// const errorHandler = require("errorHandler.js");

const connectDB = require("./database/db.js");

app.use(cors('*'));
app.use(logRequest);
const app = express();
app.use(express.json()); // Parse JSON bodies


app.get('todos/:id', async(req, res))=>{
  try{
    const todo = await Todo.findById(req.params.validate);

    if(!todo){
      return res.status(404).json({message: "Not found"});
    }
    res.status(200).json(todo);
  }catch(error){
    next(error);
  }
}


// GET All – Read
app.get('/todos', async(req, res, next) => {
  const todos = await Todo.find({});
  res.status(200).json(todos); // Send array as JSON

});

// POST New – Create
app.post('/todos', validate, async (req, res, next) => {
  const {task, completed} = req.body;
  const newTodo = new Todo({
    task, 
    completed,
  });
  
  await newTodo.save();
  try{
  res.status(201).json(newTodo); // Echo back
  } catch (error) {
    next(error);  
  }
});

// PATCH Update – Partial
app.patch('/todos/:id', async(req, res, next) => {
  try{
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body,{
      new: true
    } );
    if(!todo){
      return res.status(404).json({message:"Todo not found"});
    }
  res.status(200).json(todo);
  }catch(error){
    next(error);
  }
});

// DELETE Remove
app.delete('/todos/:id', async(req, res, next) => {
  try{
    const todo = await Todo.findByIdAndDelete(req.params.id); 
  if(!todo){
    return res.status(404).json({message: "Todo not found"});
  }
  res.status(200).json({message: `Todo ${req.params.id} deleted`}); // Silent success
}catch (error){
  next(error);
}
});

app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

// GET /todos?completed=false
app.get('/todos', async (req, res) => {
    try {
        // Extract query parameter
        const { completed } = req.query;

        // Build filter object
        let filter = {};

        if (completed !== undefined) {
            // Convert "true"/"false" to boolean
            filter.completed = completed === 'true';
        }

        // Fetch from DB
        const todos = await Todo.find(filter);

        res.status(200).json({
            success: true,
            count: todos.length,
            data: todos
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
