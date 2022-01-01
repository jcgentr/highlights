function setHighlightColor(): string {
	let highlightColor = "";
	chrome.storage.sync.get("color", ({ color }) => {
		const styleElem = document.head.appendChild(
			document.createElement("style")
		);
		styleElem.innerHTML = `::selection {background: ${color};}`;
		highlightColor = color;
	});
	return highlightColor;
}

export { setHighlightColor };
