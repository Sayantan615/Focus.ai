import "./assets/TaskDetail.css";
import React, { useState, useEffect } from "react";

function TaskDetail(props) {
  // Initialize state variables for title and description
  const [tempTitle, setTempTitle] = useState(props.TaskDetails.title || "");
  const [tempDescription, setTempDescription] = useState(
    props.TaskDetails.description || ""
  );

  // Update the state when props.TaskDetails changes
  useEffect(() => {
    setTempTitle(props.TaskDetails.title || "");
    setTempDescription(props.TaskDetails.description || "");
  }, [props.TaskDetails]);

  const sendDatatoDashboard = () => {
    props.onSignal({ title: tempTitle, description: tempDescription });
  };

  const cancelUpdate = () => {
    // Reset the input and textarea values to their original values
    setTempTitle(props.TaskDetails.title || "");
    setTempDescription(props.TaskDetails.description || "");
  };

  return (
    <div className="taskdetail_container">
      <input
        type="text"
        value={tempTitle}
        onChange={(e) => setTempTitle(e.target.value)}
        placeholder="Task Title Empty"
      />
      <textarea
        type="text"
        value={tempDescription}
        onChange={(e) => setTempDescription(e.target.value)}
        placeholder="Task Description Empty"
      />
      <div className="flex taskDetail_btn_container">
        <button onClick={sendDatatoDashboard}>save</button>
        <button onClick={cancelUpdate}>cancel</button>
      </div>
    </div>
  );
}

export default TaskDetail;
