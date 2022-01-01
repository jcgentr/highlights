import { setHighlightColor } from "./utils/setHighlightColor";

const highlightColor = setHighlightColor();
console.log({ highlightColor });

let text = "";
let baseURI = "";

let toolTip = document.createElement("div");
toolTip.innerHTML = "<strong>Add</strong>";
toolTip.className = "rect";
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
// if the toolTip is clicked
toolTip.addEventListener("click", (e) => {
	e.preventDefault();
	e.stopPropagation();
	chrome.storage.sync.get("highlights", (data) => {
		console.log("highlights: ", data.highlights);
		chrome.storage.sync.set({
			highlights: [...data.highlights, { note: text, href: baseURI }],
		});
	});
	toolTip.style.display = "none";
});
toolTip.style.display = "none"; // starts off hidden
document.body.appendChild(toolTip);

let mouseMoved = false;

function drawTooltipNearSelection(selection: Selection) {
	const range = selection.getRangeAt(0); // the range at first selection group
	const rect = range.getBoundingClientRect(); // and convert this to useful data

	if (rect.width > 0) {
		const compStyles = window.getComputedStyle(
			selection.anchorNode.parentElement
		);
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

// user released mouse button after selecting text
document.addEventListener("mouseup", (e) => {
	e.preventDefault();
	e.stopPropagation();
	const selection = window.getSelection();
	const textSelected = selection.toString();
	if (textSelected.length) {
		mouseMoved = true;
		text = textSelected;
		// TODO: may have to remove any existing jump links (#) in baseURI
		baseURI =
			selection.anchorNode.baseURI + `#:~:text=${encodeURIComponent(text)}`;
		console.log({ selection });
		console.log({ baseURI });
		drawTooltipNearSelection(selection);
	}
});

// click event captured after mouseup or otherwise
document.addEventListener("click", (e) => {
	if (toolTip && !mouseMoved) {
		toolTip.style.display = "none";
	}
	mouseMoved = false;
});
