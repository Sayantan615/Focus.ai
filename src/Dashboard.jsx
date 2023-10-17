import "./App.css";
import { useEffect, useState } from "react";
import TaskDetail from "./TaskDetail";
import Timer from "./Timer";
import AddTask from "./AddTask";
const localStoragePush = (data) => {
  chrome.storage.sync.set({ data }, () => {
    console.log(`Data is Saved`);
  });
};
const updateTaskList = (callback) => {
  chrome.storage.sync.get(["data"], (res) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      callback([]);
    } else {
      const retrievedData = res["data"];
      console.log(retrievedData);
      if (retrievedData) {
        callback(retrievedData);
      } else {
        callback([]);
      }
    }
  });
};

function Dashboard() {
  const [taskList, setTaskList] = useState([
    {
      title: "Be more productive",
      description: "This is a dummy task",
      promo: { total: 0, done: 0, remaining: 0 },
      status: false,
    },
  ]);
  const sortSaveandUpdateTaskList = () => {
    const sortedTaskList = [...taskList]; 
    sortedTaskList.sort((a, b) =>
      a.status === b.status ? 0 : a.status ? 1 : -1
    );
    setTaskList(sortedTaskList);
    localStoragePush(sortedTaskList);
    updateTaskList((data) => {
      setTaskList([...data]);
    });
  };
  useEffect(() => {
    updateTaskList((data) => {
      setTaskList([...data]);
    });
  }, []);
  const [expandedTaskIndex, setExpandedTaskIndex] = useState();
  const [addTaskButtonState, setaddTaskButtonState] = useState(false);
  const [sortState, setSortState] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const insertTask = (data) => {
    if (data.title.length !== 0) {
      setaddTaskButtonState(false);
      setaddTaskButtonState(true);
      let newtask = data.title;
      let newtaskdescription = data.description;
      const updatedTaskList = [
        {
          title: newtask,
          description: newtaskdescription,
          promo: { total: 0, done: 0, remaining: 0 },
          status: false,
        },
        ...taskList,
      ];
      setTaskList(updatedTaskList);
      localStoragePush(updatedTaskList);
      updateTaskList((data) => {
        setTaskList([...data]);
      });
    }
  };
  const handleChildSignal = (data) => {
    let index = expandedTaskIndex;
    setExpandedTaskIndex(null);
    taskList[index].title = data.title;
    taskList[index].description = data.description;
    const newTaskList = taskList;
    localStoragePush(newTaskList);
  };
  const handleClearHistory = () => {
    let newTaskList = [
      { title: "Be More Productive", description: "", status: false },
    ];
    setTaskList(newTaskList);
    localStoragePush(newTaskList);
    console.log(newTaskList);
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
    const confirmation = window.confirm("Do you want to delete the task?");

    // Check if the user confirmed the deletion
    if (confirmation) {
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
    }
  };
  const handleTaskView = (index) => {
    // Toggle the expanded task index
    if (expandedTaskIndex === index) {
      setExpandedTaskIndex(null);
    } else {
      setExpandedTaskIndex(index);
    }
  };
  const closeAddTaskContainer = () => {
    setaddTaskButtonState(false);
  };

  const changeStatus = (index) => {
    taskList[index].status = !taskList[index].status;
    const newTaskList = taskList;
    setTaskList(newTaskList);
    sortSaveandUpdateTaskList();
  };
  return (
    <>
      <div className="container">
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
          <div className="top_container">
            <h1 className="top_container_heading">Priority Tasks</h1>
            <a
              onClick={() => {
                setIsMenuActive(!isMenuActive);
              }}
              className="toggle_menu_button"
            >
              {!isMenuActive ? (
                <i className="fa-solid fa-bars"></i>
              ) : (
                <i className="fa-solid fa-xmark"></i>
              )}
            </a>
            {isMenuActive ? (
              <div className="toggleMenu">
                <div
                  className="menu-option"
                  onClick={() => {
                    setIsMenuActive(false);
                    setSortState(!sortState);
                  }}
                >
                  Rearange
                </div>
                <div
                  className="menu-option"
                  onClick={() => {
                    handleClearHistory();
                    setIsMenuActive(false);
                  }}
                >
                  Clear all
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <hr style={{ background: "black", height: "1px", width: "90%" }} />
          <div className="task_container">
            {taskList &&
              taskList.map((tasks, index) => (
                <div className="task" key={index}>
                  <div
                    className="flex closed_task"
                    onClick={(e) => {
                      handleTaskView(index, e);
                    }}
                  >
                    <div
                      className="flex task_btn_container"
                      style={{ marginRight: "0.5rem" }}
                    >
                      <a
                        className="btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          changeStatus(index);
                        }}
                      >
                        <i className="fa-solid fa-check"></i>
                      </a>
                    </div>
                    <p
                      className={
                        tasks.status && tasks.status === true
                          ? "linethrough"
                          : ""
                      }
                    >
                      {tasks.title.substring(0, 20)}
                      {tasks.title.length > 20 ? "..." : ""}
                    </p>
                    <div className="flex task_btn_container">
                      {sortState ? (
                        <>
                          <div
                            className="btn move-up"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveUp(index);
                            }}
                          >
                            <i className="fa-solid fa-arrow-up"></i>
                          </div>
                          <div
                            className="btn move-down"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveDown(index);
                            }}
                          >
                            <i className="fa-solid fa-arrow-down"></i>
                          </div>
                        </>
                      ) : null}
                      <div
                        className="btn move-up"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(index);
                        }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </div>
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
        </div>
      </div>
    </>
  );
}

export default Dashboard;
