let color = "#E189D9";

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ color });
	chrome.storage.sync.set({ highlights: [{ note: "hello world!" }] });
});
