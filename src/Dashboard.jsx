import "./App.css";
import { useEffect, useState } from "react";
import TaskDetail from "./TaskDetail";
import Timer from "./Timer";
import AddTask from "./AddTask";
const localStoragePush = (data) => {
  chrome.storage.sync.set({ data }, () => {
    console.log(`Data is Saved ${data}`);
    console.log(data);
  });
};
const updateTaskList = (callback) => {
  chrome.storage.sync.get(["data"], (res) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      callback([]); // Return an empty array in case of an error.
    } else {
      const retrievedData = res["data"];
      console.log(retrievedData);
      if (retrievedData) {
        callback(retrievedData); // Only callback if retrievedData is an array.
      } else {
        callback([]); // Return an empty array if retrievedData is not an array.
      }
    }
  });
};

function Dashboard() {
  const [taskList, setTaskList] = useState([
    { title: "Be more productive", description: "This is a dummy task" },
  ]);
  useEffect(() => {
    updateTaskList((data) => {
      setTaskList([...data]);
    });
  }, []);
  const [expandedTaskIndex, setExpandedTaskIndex] = useState();
  const [addTaskButtonState, setaddTaskButtonState] = useState(false);
  const insertTask = (data) => {
    // Check if 'task' is empty
    if (data.title.length !== 0) {
      setaddTaskButtonState(false);
      let newtask = data.title;
      let newtaskdescription = data.description;
      const updatedTaskList = [
        ...taskList,
        { title: newtask, description: newtaskdescription },
      ];
      setTaskList(updatedTaskList);
      localStoragePush(updatedTaskList);
      updateTaskList((data) => {
        setTaskList([...data]);
      });
    }
  };
  const handleChildSignal = (data) => {
    // Do something with the data received from the child
    console.log("Data received from child:", data);
    let index = expandedTaskIndex;
    setExpandedTaskIndex(null);
    taskList[index].title = data.title;
    taskList[index].description = data.description;
    const newTaskList = taskList;
    localStoragePush(newTaskList);
  };
  const handleClearHistory = () => {
    let newTaskList = [{ title: "Be More Productive", description: "" }];
    localStoragePush(newTaskList);
    setTaskList(newTaskList);
  };
  const moveUp = (index) => {
    if (index > 0) {
      let temptaskList = [...taskList];
      let currTask = temptaskList[index];
      temptaskList[index] = temptaskList[index - 1];
      temptaskList[index - 1] = currTask;
      const updatedTaskList = temptaskList;
      setTaskList(updatedTaskList);
      localStoragePush(updatedTaskList);
    }
  };
  const moveDown = (index) => {
    let temptaskList = [...taskList];
    if (index < temptaskList.length - 1) {
      let currTask = temptaskList[index];
      temptaskList[index] = temptaskList[index + 1];
      temptaskList[index + 1] = currTask;
      const updatedTaskList = temptaskList;
      setTaskList(updatedTaskList);
      localStoragePush(updatedTaskList);
    }
  };
  const deleteItem = (index) => {
    let temptaskList = [...taskList];
    let newTaskList = [];
    if (temptaskList.length === 1) {
      newTaskList = [{ title: "Be More Productive", description: "" }];
    }
    temptaskList.forEach((task, i) => {
      if (index !== i) newTaskList.push(task);
    });
    const updatedTaskList = newTaskList;
    setTaskList(updatedTaskList);
    localStoragePush(updatedTaskList);
  };
  const handleTaskView = (index) => {
    // Toggle the expanded task index
    if (expandedTaskIndex === index) {
      setExpandedTaskIndex(null); // Collapse the task if it's already expanded
    } else {
      setExpandedTaskIndex(index); // Expand the clicked task
    }
  };
  const closeAddTaskContainer = () => {
    setaddTaskButtonState(false);
  };
  return (
    <>
      <div className="container">
        {/* Pomodoro timer will go here */}
        {/* Timer */}
        <div className="time_switcher">
          <div className="timer_container">
            <h1>Pomodoro</h1>
            <Timer id={101} time={1500} />
          </div>
          <div className="timer_container">
            <h1>Short Break</h1>
            <Timer id={102} time={300} />
          </div>
          <div className="timer_container">
            <h1>Long Break</h1>
            <Timer id={103} time={900} />
          </div>
        </div>

        <div className="task_section">
          {addTaskButtonState ? (
            <div className="add_task_container">
              <AddTask onSignal={insertTask} />
              <button className="cancel_button" onClick={closeAddTaskContainer}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ) : (
            <div className="add_task_button_container">
              <button
                className="add_task_btn"
                onClick={() => {
                  setaddTaskButtonState(true);
                }}
              >
                Add Task
              </button>
            </div>
          )}
          <h1>Priority Tasks</h1>
          <div className="task_container">
            {taskList &&
              taskList.map((tasks, index) => (
                <div className="task" key={index}>
                  <div className="flex closed_task">
                    <p onClick={() => handleTaskView(index)}>{tasks.title}</p>
                    <div className="flex">
                      <div
                        className="btn move-up"
                        onClick={() => moveUp(index)}
                      >
                        <i className="fa-solid fa-arrow-up"></i>
                      </div>
                      <div
                        className="btn move-down"
                        onClick={() => moveDown(index)}
                      >
                        <i className="fa-solid fa-arrow-down"></i>
                      </div>
                    </div>
                    <div
                      className="btn move-up"
                      onClick={() => deleteItem(index)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                  {/* Render the big view content here */}
                  {expandedTaskIndex === index && (
                    <TaskDetail
                      TaskDetails={tasks}
                      onSignal={handleChildSignal}
                    />
                  )}
                  {/* Render the big view content here */}
                </div>
              ))}
          </div>
          <button className="clear_btn" onClick={handleClearHistory}>
            Clear History
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
