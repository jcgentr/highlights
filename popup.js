let highlightColorPicker = document.getElementById("highlightColor");

chrome.storage.sync.get("color", ({ color }) => {
	highlightColorPicker.setAttribute("value", color);
});

// When color picker changes, inject setHighlightColor into current page
highlightColorPicker.addEventListener("change", async (event) => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.storage.sync.set({ color: event.target.value });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: setHighlightColor,
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
		highlightsList.appendChild(li);
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
