const mainTable = document.getElementById("main-table");

const enforceMinMax = (el) => {
	if (el.value != "") {
		if (parseInt(el.value) < parseInt(el.min)) el.value = el.min;
    	if (parseInt(el.value) > parseInt(el.max)) el.value = el.max;
    }
}

let lastNonogramWidth = 5;
let lastNonogramHeight = 5;
let lastHintWidth = 2;
let lastHintHeight = 2;

const resizeCells = () => {
	const cellSize = Math.min(window.innerWidth * 0.6 / (lastNonogramWidth + lastHintWidth), window.innerHeight * 0.6 / (lastNonogramHeight + lastHintHeight));

	mainTable.querySelectorAll("th").forEach(el => {
		el.style = `width: ${cellSize}px; height: ${cellSize}px;`;
	})

	mainTable.querySelectorAll("tr").forEach(el => {
		el.style = `height: ${cellSize}px;`;
	})

	mainTable.querySelectorAll("th.hint input").forEach(el => {
		el.style = `font-size: ${cellSize / 2}px;`;
	})
}
window.addEventListener("resize", resizeCells);

const onBoardCellsChanged = () => {
	solveNonogram(mainTable, lastNonogramWidth, lastNonogramHeight, lastHintWidth, lastHintHeight);
}

const createEmptyBoard = (nonogramWidth, nonogramHeight, leftHintCount, topHintCount) => {
	lastNonogramWidth = nonogramWidth;
	lastNonogramHeight = nonogramHeight;
	lastHintWidth = leftHintCount;
	lastHintHeight = topHintCount;

	mainTable.innerHTML = "";
	for (let y = 0; y < nonogramHeight + topHintCount; ++y) {
		const row = document.createElement("tr");
		for (let x = 0; x < nonogramWidth + leftHintCount; ++x) {
			const column = document.createElement("th");
			row.appendChild(column);
			if (x < leftHintCount && y < topHintCount) column.classList.add("hidden");
			else if (x < leftHintCount || y < topHintCount) {
				column.classList.add("hint");
				const cellInput = document.createElement("input");
				cellInput.name = `ix${x}y${y}`
				cellInput.maxLength = 1;
				column.appendChild(cellInput);		
			}
		}
		mainTable.appendChild(row);
	}
	
	const k = 0.05;
	mainTable.style.transform = `translate(-50%, -50%) scale(${1 / (1 + k * (nonogramWidth + nonogramHeight))});`; 
	resizeCells();
	populateCellInputs();
}

const setTableInvalid = (inv) => {
	if(inv)
		document.getElementById("invalid-table").classList.remove("closed");
	else
		document.getElementById("invalid-table").classList.add("closed");
}

const setTableMulti = (inv) => {
	if(inv)
		document.getElementById("multi-table").classList.remove("closed");
	else
		document.getElementById("multi-table").classList.add("closed");
}

const boardSetMark = (x, y, set) => {
	if (set)
		mainTable.rows[y + lastHintHeight].cells[x + lastHintWidth].classList.add("marked")
	else
		mainTable.rows[y + lastHintHeight].cells[x + lastHintWidth].classList.remove("marked")
}

createEmptyBoard(lastNonogramWidth, lastNonogramHeight, lastHintWidth, lastHintHeight);

const nonogramWidthInput = document.getElementById("nonogram-width");
const nonogramHeightInput = document.getElementById("nonogram-height");
const hintWidthInput = document.getElementById("hint-width");
const hintHeightInput = document.getElementById("hint-height");

nonogramWidthInput.value = 5;
nonogramHeightInput.value = 5;
hintWidthInput.value = 2;
hintHeightInput.value = 2;

nonogramWidthInput.min = 1;
nonogramHeightInput.min = 1;
hintWidthInput.min = 1;
hintHeightInput.min = 1;

const onBoardInputsUpdated = () => 
	createEmptyBoard(parseInt(nonogramWidthInput.value), parseInt(nonogramHeightInput.value), parseInt(hintWidthInput.value), parseInt(hintHeightInput.value));

nonogramWidthInput.addEventListener("change", onBoardInputsUpdated);
nonogramHeightInput.addEventListener("change", onBoardInputsUpdated);
hintWidthInput.addEventListener("change", onBoardInputsUpdated);
hintHeightInput.addEventListener("change", onBoardInputsUpdated);
