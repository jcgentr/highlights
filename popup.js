let highlightColorPicker = document.getElementById("highlightColor");

chrome.storage.sync.get("color", ({ color }) => {
	highlightColorPicker.setAttribute("value", color);
});

// When the button is clicked, inject setPageBackgroundColor into current page
highlightColorPicker.addEventListener("change", async (event) => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.storage.sync.set({ color: event.target.value });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: setHighlightColor,
	});
});

// The body of this function will be executed as a content script inside the
// current page
function setHighlightColor() {
	chrome.storage.sync.get("color", ({ color }) => {
		console.log({ color });
		const styleElem = document.head.appendChild(
			document.createElement("style")
		);
		styleElem.innerHTML = `::selection {background: ${color};}`;
	});
}

let highlightsList = document.getElementById("highlightsList");

chrome.storage.sync.get("highlights", ({ highlights }) => {
	for (highlight of highlights) {
		let li = document.createElement("li");
		li.innerText = highlight.note;
		highlightsList.appendChild(li);
	}
});
