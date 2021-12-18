let highlightColor;

function setHighlightColor() {
	chrome.storage.sync.get("color", ({ color }) => {
		console.log({ color });
		highlightColor = color;
		const styleElem = document.head.appendChild(
			document.createElement("style")
		);
		styleElem.innerHTML = `::selection {background: ${color};}`;
	});
}

setHighlightColor();

let text = "";

let toolTip = document.createElement("div");
toolTip.innerHTML = "<strong>Add</strong>";
toolTip.class = "rect";
toolTip.style.position = "absolute";
toolTip.style.backgroundColor = "#898A95";
toolTip.style.color = "#fff";
toolTip.style.height = "32px";
toolTip.style.width = "45px";
toolTip.style.borderRadius = "5px";
toolTip.style.cursor = "pointer";
toolTip.style.display = "flex";
toolTip.style.justifyContent = "center";
toolTip.style.alignItems = "center";
toolTip.style.zIndex = "9999";
toolTip.addEventListener("click", (e) => {
	e.preventDefault();
	e.stopPropagation();
	chrome.storage.sync.get("highlights", (data) => {
		console.log("highlights: ", data.highlights);
		chrome.storage.sync.set({
			highlights: [...data.highlights, { note: text }],
		});
	});
	toolTip.style.display = "none";
});
toolTip.style.display = "none";
document.body.appendChild(toolTip);

let mouseMoved = false;

function drawTooltipNearSelection() {
	const selection = window.getSelection(), // get the selection then
		range = selection.getRangeAt(0), // the range at first selection group
		rect = range.getBoundingClientRect(); // and convert this to useful data

	if (rect.width > 0) {
		const compStyles = window.getComputedStyle(selection.anchorNode.parentNode);
		const parentLineHeight = parseFloat(
			compStyles.getPropertyValue("line-height")
		);
		// WHY DOES THIS WORK SO WELL?
		const yPos =
			rect.top +
			window.scrollY -
			parentLineHeight / 2 -
			parseInt(toolTip.style.height) / 2 -
			10;
		toolTip.style.top = yPos + "px";

		const xPos = rect.right - parseInt(toolTip.style.width, 10);
		toolTip.style.left = xPos + "px";
		toolTip.style.display = "flex";
	}
}

document.addEventListener("mouseup", (e) => {
	e.preventDefault();
	e.stopPropagation();
	if (window.getSelection().toString().length) {
		mouseMoved = true;
		text = window.getSelection().toString();
		drawTooltipNearSelection();
	}
});

document.addEventListener("click", (e) => {
	if (toolTip && !mouseMoved) {
		toolTip.style.display = "none";
	}
	mouseMoved = false;
});
