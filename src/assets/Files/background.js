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
            console.error(chrome.runtime.lastError.message);
          } else {
            // Check if the message port is still open before sending a response
            if (response && response.port && !response.port.sender.tab) {
              console.warn("Message port is closed, response not sent.");
            }
          }
        }
      );
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
  // Remove the response argument here, just use sendResponse without arguments.
  sendResponse();
});
