// background.js
console.log("bg_script");

let totalSeconds = 1500;
let isActive = false;
let interval;
let id;

const startTimer = () => {
  isActive = true;
  if (totalSeconds >= 0) {
    interval = setInterval(() => {
      totalSeconds -= 1;
      chrome.runtime.sendMessage({
        action: "updateTimer",
        id: id,
        time: totalSeconds,
      });
      if (!totalSeconds) {
        clearInterval(interval);
      }
    }, 1000);
  }
};

const stopTimer = () => {
  isActive = false;
  clearInterval(interval);
};

const resetTimer = () => {
  isActive = false;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start") {
    totalSeconds = message.time;
    id = message.id;
    if (!isActive) {
      startTimer();
    }
  } else if (message.action === "stop") {
    stopTimer();
  } else if (message.action === "reset") {
    resetTimer();
  }
});
