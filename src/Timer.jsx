import { useState, useEffect } from "react";
import "./App.css";

const Timer = (props) => {
  const [totalSeconds, setTotalSeconds] = useState(props.time);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    setTotalSeconds(props.time);
  }, [props.time]);
  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds((prevTotalSeconds) => prevTotalSeconds - 1);
      }, 1000);
    } else if (!isActive && totalSeconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, totalSeconds]);

  const formatTime = (seconds) => {
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTotalSeconds(1500);
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
