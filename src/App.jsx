import React, { useState, useEffect } from 'react';
import "./App.css"

function App() {
  const [tabs, setTabs] = useState([]);
  const [permanentTabs, setPermanentTabs] = useState([]);

  useEffect(() => {
    chrome.storage.sync.get('permanentTabs', ({ permanentTabs }) => {
      setPermanentTabs(permanentTabs || []);
    });

    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      setTabs(tabs);
    });
  }, []);

  const togglePermanentTab = (url) => {
    let updatedTabs;
    if (permanentTabs.includes(url)) {
      updatedTabs = permanentTabs.filter((tab) => tab !== url);
    } else {
      updatedTabs = [...permanentTabs, url];
    }

    chrome.storage.sync.set({ permanentTabs: updatedTabs }, () => {
      setPermanentTabs(updatedTabs);
    });
  };

  const closeNonPermanentTabs = () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      chrome.storage.sync.get("permanentTabs", ({ permanentTabs }) => {
        tabs.forEach((tab) => {
          if(!permanentTabs.includes(tab.url)) {
            chrome.tabs.remove(tab.id);
          }
        });
      });
    });
  };

  return (
    <div>
      <h3>Permanent Tabs</h3>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <input
              type="checkbox"
              checked={permanentTabs.includes(tab.url)}
              onChange={() => togglePermanentTab(tab.url)}
            />
            {tab.title}
          </li>
        ))}
      </ul>
      <button onClick={closeNonPermanentTabs}>Close Non-Permanent Tabs</button>
    </div>
  );
}

export default App;
