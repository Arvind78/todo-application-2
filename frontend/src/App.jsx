import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./App.css";

const App = () => {
  // State variables for task input and task data
  const [taskValue, setTaskValue] = useState("");
  const [taskData, setTaskData] = useState([]);

  // useEffect to clear tasks initially 
  // useEffect(() => {
  //   getDataHandler();
  // }, []);

  // Function to fetch tasks from the server
  const getDataHandler = () => {
    axios("http://localhost:8080/todos")
      .then((data) => setTaskData(data.data))
      .catch((err) => { throw err });
  }

  // Function to handle adding a new task
  const taskHandler = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8080/todos", { task: taskValue })
      .then((data) => {
        getDataHandler(),
        console.log(data.data);
        // Fetch updated tasks after adding a new one
      })
      .catch((err) => { throw err });
    setTaskValue(""); // Clear the task input field after adding a task
  }

  const removeTodoHandler = (id) => {
 
    axios.delete(`http://localhost:8080/todos/${id}`)
      .then(() => {
        getDataHandler(); // Fetch updated tasks after adding a new one
      })
      .catch((err) => { throw err });
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
              <li>
                <p>{item.task}</p>  
              <span onClick={()=>removeTodoHandler(item.id)}>X</span>
              </li>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App;
