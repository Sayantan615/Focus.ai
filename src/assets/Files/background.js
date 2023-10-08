let totalSeconds = 1500;
let isActive = false;
let interval;
let id;

const startTimer = () => {
  isActive = true;
  if (totalSeconds >= 0) {
    interval = setInterval(() => {
      totalSeconds -= 1;
      chrome.runtime.sendMessage(
        {
          action: "updateTimer",
          id: id,
          time: totalSeconds,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            // Handle the error, e.g., log it
            console.log(chrome.runtime.lastError);
          }
        }
      );
      if (!totalSeconds) {
        clearInterval(interval);
        // chrome.alarms.create({ delayInMinutes: 0.1 });
      }
    }, 1000);
  }
};

const stopTimer = () => {
  isActive = false;
  clearInterval(interval);
};

const resetTimer = () => {
  stopTimer();
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
  return Promise.resolve("Response to keep the console quiet");
});
