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

function drawTooltipNearSelection(text) {
	const selection = window.getSelection(), // get the selection then
		range = selection.getRangeAt(0), // the range at first selection group
		rect = range.getBoundingClientRect(); // and convert this to useful data

	if (rect.width > 0) {
		if (div) {
			div.parentNode.removeChild(div);
		}
		div = document.createElement("div");
		div.innerHTML = "<strong>Add</strong>";
		div.class = "rect";
		div.style.position = "absolute";
		div.style.backgroundColor = "#898A95";
		div.style.color = "#fff";
		div.style.padding = "5px";
		div.style.borderRadius = "5px";
		div.style.cursor = "pointer";

		const yPos = rect.top + window.scrollY - 30;
		div.style.top = yPos + "px";

		const xPos = rect.right - 25;
		div.style.left = xPos + "px";

		console.log(selection.anchorNode.parentNode);
		console.log({ rect });
		console.log({
			x: window.scrollX,
			y: window.scrollY,
			sum: yPos,
		});

		div.addEventListener("click", (e) => {
			console.log("clicked", { target: e.target });
			console.log("setting to:", text);
			chrome.storage.sync.set({
				highlights: [{ note: text }],
			});
			div.parentNode.removeChild(div);
			div = null;
		});
		document.body.appendChild(div);
	}
}

document.addEventListener("mouseup", (event) => {
	if (window.getSelection().toString().length) {
		console.log(window.getSelection());
		let exactText = window.getSelection().toString();
		console.log({ exactText });
		drawTooltipNearSelection(exactText);
	}
});
