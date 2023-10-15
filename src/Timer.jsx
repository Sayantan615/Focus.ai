import { useState, useEffect } from "react";
import "./App.css";


const Timer = (props) => {
  const [totalSeconds, setTotalSeconds] = useState(props.time);
  const [id, setId] = useState();
  useEffect(() => {
    setTotalSeconds(props.time);
    setId(props.id);
  }, [props.time, props.id]);

  useEffect(() => {
    const messageListener = (message) => {
      if (message.action === "updateTimer") {
        if (message.id === id) {
          setTotalSeconds(message.time);
        }
      }
      return Promise.resolve("Response to keep the console quiet");
    };
    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [id]);

  const formatTime = (seconds) => {
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    chrome.runtime.sendMessage({
      action: "start",
      time: totalSeconds,
      id: id,
    });
  };

  const stopTimer = async () => {
    await chrome.runtime.sendMessage({ action: "stop" });
  };

  const resetTimer = () => {
    chrome.runtime.sendMessage({ action: "reset" });
    setTotalSeconds(props.time);
  };

  return (
    <>
      <h1 className="timer">{formatTime(totalSeconds)}</h1>
      <div className="btn_container">
        <button className="btn" onClick={startTimer}>
          Start
        </button>
        <button className="btn" onClick={stopTimer}>
          Stop
        </button>
        <button className="btn" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </>
  );
};

export default Timer;
