import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./App.css";

const App = () => {
  // State variables for task input and task data
  const [taskValue, setTaskValue] = useState("");
  const [taskData, setTaskData] = useState([]);

  // useEffect to clear tasks initially 
  useEffect(() => {
    axios("https://todo-8m11.onrender.com/clear")
      .then((data) => console.log(data.data)) 
      .catch((err) => { throw err });
  }, []);

  // Function to fetch tasks from the server
  const getDataHandler = () => {
    axios("https://todo-8m11.onrender.com/todos")
      .then((data) => setTaskData(data.data))
      .catch((err) => { throw err });
  }

  // Function to handle adding a new task
  const taskHandler = (e) => {
    e.preventDefault();
    axios.post("https://todo-8m11.onrender.com/add/todo", { task: taskValue })
      .then(() => {
        getDataHandler(); // Fetch updated tasks after adding a new one
      })
      .catch((err) => { throw err });
    setTaskValue(""); // Clear the task input field after adding a task
  }

  return (
    <div className='main-container'>
      <div className='task-input-container'>
        <h1>Todo List Application</h1>
        <form onSubmit={taskHandler}>
          <span>Enter a Task</span>
          <input type="text" placeholder='Enter a task ' onChange={(e) => setTaskValue(e.target.value)} value={taskValue} />
          <button type='submit'>Add Task</button>
        </form>
      </div>
      <div className='task-data'>
        {/* Mapping through taskData to display the tasks */}
        {
          taskData?.map((item, index) => (
            <div className='task-list' key={index}>
              <li>{item}</li>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App;
