let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ color });
	chrome.storage.sync.set({ highlights: [{ note: "hello world!" }] });
});

// todo: prevent reference error for document \
// setHighlightColor if tab changes to existing tab after color change
// (may have to remove and add or update injected style tag)

let activeTabId, lastUrl, lastTitle;

function getTabInfo(tabId) {
	chrome.tabs.get(tabId, (tab) => {
		if (lastUrl !== tab.url || lastTitle !== tab.title)
			console.log((lastUrl = tab.url), (lastTitle = tab.title));
	});
}

chrome.tabs.onActivated.addListener((activeInfo) => {
	console.log({ activeInfo });
	activeTabId = activeInfo.tabId;
	getTabInfo(activeTabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (activeTabId === tabId) {
		getTabInfo(tabId);
	}
	if (changeInfo.status === "complete") {
		setHighlightColor();
	}
});

function setHighlightColor() {
	chrome.storage.sync.get("color", ({ color }) => {
		console.log({ color });
		if (document) {
			const styleElem = document.head.appendChild(
				document.createElement("style")
			);
			styleElem.innerHTML = `::selection {background: ${color};}`;
		}
	});
}
