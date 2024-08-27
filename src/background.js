

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ permanentTabs: [] }, () => {
    console.log("Permanent tabs initialized.");
  });
});

chrome.action.onClicked.addListener(() => {
  closeNonPermanentTabs();
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "close-non-permanent-tabs") {
    closeNonPermanentTabs();
  }
});

function closeNonPermanentTabs() {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    chrome.storage.sync.get('permanentTabs', ({ permanentTabs }) => {
      tabs.forEach((tab) => {
        if (!permanentTabs.includes(tab.url)) {
          chrome.tabs.remove(tab.id);
        }
      });
    });
  });
}
