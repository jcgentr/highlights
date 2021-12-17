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

let div = null;
let mouseMoved = false;

function drawTooltipNearSelection(text) {
	const selection = window.getSelection(), // get the selection then
		range = selection.getRangeAt(0), // the range at first selection group
		rect = range.getBoundingClientRect(); // and convert this to useful data

	if (rect.width > 0) {
		if (div) {
			div.parentNode.removeChild(div);
			div = null;
		}
		div = document.createElement("div");
		div.innerHTML = "<strong>Add</strong>";
		div.class = "rect";
		div.style.position = "absolute";
		div.style.backgroundColor = "#898A95";
		div.style.color = "#fff";
		div.style.height = "32px";
		div.style.width = "45px";
		div.style.borderRadius = "5px";
		div.style.cursor = "pointer";
		div.style.display = "flex";
		div.style.justifyContent = "center";
		div.style.alignItems = "center";
		div.style.zIndex = "9999";

		const compStyles = window.getComputedStyle(selection.anchorNode.parentNode);
		const parentLineHeight = parseFloat(
			compStyles.getPropertyValue("line-height")
		);
		// WHY DOES THIS WORK SO WELL?
		const yPos =
			rect.top +
			window.scrollY -
			parentLineHeight / 2 -
			parseInt(div.style.height) / 2 -
			10;
		div.style.top = yPos + "px";

		const xPos = rect.right - parseInt(div.style.width, 10);
		div.style.left = xPos + "px";

		div.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			chrome.storage.sync.set({
				highlights: [{ note: text }],
			});
			div.parentNode.removeChild(div);
			div = null;
		});
		document.body.appendChild(div);
	}
}

document.addEventListener("mouseup", (e) => {
	e.preventDefault();
	e.stopPropagation();
	if (window.getSelection().toString().length) {
		mouseMoved = true;
		console.log(window.getSelection());
		let exactText = window.getSelection().toString();
		console.log({ exactText });
		drawTooltipNearSelection(exactText);
	}
});

document.addEventListener("click", (e) => {
	console.log("click event", e);
	if (div && !mouseMoved) {
		console.log("removing div...");
		div.parentNode.removeChild(div);
		div = null;
	}
	console.log("setting mouseMoved to false...");
	mouseMoved = false;
});
