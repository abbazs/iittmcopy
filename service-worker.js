chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("https://seek.onlinedegree.iitm.ac.in/")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["script.js"],
    });
  }
});

