import { useState } from "react";
import "./App.css";

const AddTask = (props) => {
  const [task, setTask] = useState("");
  const [TaskDescription, setTaskDescription] = useState("");
  const saveTask = () => {
    props.onSignal({ title: task, description: TaskDescription });
    setTask("");
    setTaskDescription("");
  };
  return (
    <>
      {/* Add Task */}
      <h1>Display date</h1>
      <input
        className="task_input task_title"
        placeholder="Type and Enter to save..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        type="text"
        onKeyDown={(e) => {
          if (task.length && e.key == "Enter") {
            saveTask();
          }
        }}
        autoFocus="true"
      />
      {/* Task Details */}
      <textarea
        className="task_input task_description"
        placeholder="Enter your task details here"
        value={TaskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        type="text"
        rows="3"
      />
      <button onClick={saveTask}>Save</button>
    </>
  );
};
export default AddTask;
