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

let highlightColorPicker = document.getElementById("highlightColor");

chrome.storage.sync.get("color", ({ color }) => {
	highlightColorPicker?.setAttribute("value", color);
});

// When color picker changes, inject setHighlightColor into current page
highlightColorPicker?.addEventListener("change", async (event: Event) => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	const input = event.target as HTMLInputElement;
	chrome.storage.sync.set({ color: input.value });

	chrome.scripting.executeScript({
		target: { tabId: tab.id ?? chrome.tabs.TAB_ID_NONE },
		func: setHighlightColor,
	});
});

let highlightsList = document.getElementById("highlightsList");

chrome.storage.sync.get("highlights", ({ highlights }) => {
	for (const highlight of highlights) {
		const li = document.createElement("li");
		const a = document.createElement("a");
		const linkText = document.createTextNode(highlight.note);
		a.appendChild(linkText);
		a.href = highlight.href;
		a.target = "_blank";
		li.appendChild(a);
		highlightsList?.appendChild(li);
	}
});

export {};
