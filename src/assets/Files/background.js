let totalSeconds = 0;
let savetotalSeconds = 0;
let isActive = false;
let interval;
let id;
let isBlocked = false;
const blockUrls = ["facebook.com/*", "instagram.com/*"];
const BlockSites = () => {
  blockUrls.forEach((domain, index) => {
    let id = index + 1;

    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: id,
          priority: 1,
          action: { type: "block" },
          condition: { urlFilter: domain, resourceTypes: ["main_frame"] },
        },
      ],
      removeRuleIds: [id],
    });
  });
};
const unBlockSites = async () => {
  let remUrlIdList = [];
  blockUrls.forEach((url, index) => {
    remUrlIdList.push(index + 1);
  });
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: remUrlIdList,
  });
};
const reloadPages = () => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      // Check if the tab's URL matches any of the blockUrls
      if (
        blockUrls.some((urlPattern) => new RegExp(urlPattern).test(tab.url))
      ) {
        chrome.tabs.reload(tab.id);
      }
    });
  });
};
const sendNotification = (title, message, requireInteraction) => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: title,
    message: message,
    requireInteraction: requireInteraction,
  });
};

const sendMessage = (action, id, time) => {
  chrome.runtime.sendMessage(
    {
      action: action,
      id: id,
      time: time,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        // console.log(chrome.runtime.lastError);
      }
    }
  );
};

const startTimer = async () => {
  isActive = true;
  if (totalSeconds >= 0) {
    sendNotification("Timer started", "", false);
    interval = setInterval(() => {
      totalSeconds -= 1;
      sendMessage("updateTimer", id, totalSeconds);

      if (totalSeconds === 0) {
        stopTimer();
        resetTimer();
        if (id == 102) {
          sendNotification("Break Over", "Break ended get back to work.", true);
        } else if (id == 101) {
          clear();
          sendNotification("25 minutes over", "well done!", true);
        } else if (id == 103) {
          sendNotification(
            "Break Over",
            "Get back to work after the refreshment",
            true
          );
        }
      }
    }, 1000);
  }
};

const stopTimer = async () => {
  isActive = false;
  clearInterval(interval);
};

const resetTimer = () => {
  stopTimer();
  sendMessage("updateTimer", id, savetotalSeconds);
  isActive = false;
};

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "start") {
    totalSeconds = message.time;
    savetotalSeconds = message.time;
    id = message.id;
    if (!isActive) {
      if (id === 101) {
        isBlocked = true;
        BlockSites();
        reloadPages();
      }
      startTimer();
    }
  } else if (message.action === "stop") {
    stopTimer();
    if (isBlocked) {
      unBlockSites();
      reloadPages();
      isBlocked = false;
    }
  } else if (message.action === "reset") {
    resetTimer();
    if (isBlocked) {
      unBlockSites();
      reloadPages();
      isBlocked = false;
    }
  }
  return Promise.resolve("Response to keep the console quiet");
});
