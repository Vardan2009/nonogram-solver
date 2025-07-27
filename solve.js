const populateMatrices = (tableEl, nonogramW, nonogramH, hintW, hintH) => {
	const lastNonogramLeftMatrix = [];
	const lastNonogramTopMatrix = [];

	for(let x = hintW; x < nonogramW + hintW; ++x) {
		const topLine = []
		for(let y = 0; y < hintH; ++y) {
			const val = parseInt(tableEl.rows[y].cells[x].querySelector("input").value);
			if (!isNaN(val)) topLine.push(val);
		}
		lastNonogramTopMatrix.push(topLine);
	}

	for(let y = hintH; y < hintH + nonogramH; ++y) {
		const leftLine = []
		for(let x = 0; x < hintW; ++x) {
			const val = parseInt(tableEl.rows[y].cells[x].querySelector("input").value);
			if (!isNaN(val)) leftLine.push(val);
		}
		lastNonogramLeftMatrix.push(leftLine);
	}

	return [lastNonogramLeftMatrix, lastNonogramTopMatrix];
}

const generateBinConfig = (runs, len) => {
	const cnf = [];

	const generateConfig = (current, startPos, currentRuns) => {
		if (currentRuns.length <= 0) {
			cnf.push(current);
			return;
		}

		const run = currentRuns[0];	
		
		for (let pos = startPos; pos <= len - run; ++pos) {
			let possibility = 0;
			for(let ni = 0; ni < run; ++ni) possibility += Math.pow(2, ni + pos);

			generateConfig(possibility | current, pos + run + 1, currentRuns.slice(1));
		}
	}

	generateConfig(0, 0, runs);

	return cnf;
}

function binFilter(rows, columns) {
	let count = 1
	while (count != 0) {

		count = 0
		rows.forEach((row, index) => {
			let mustBeFilled = -1
			for (let j = 0; j < row.length; j++) {
				mustBeFilled = mustBeFilled & row[j]
			}

			let notFilled = 0
			for (let j = 0; j < row.length; j++) {
				notFilled = notFilled | row[j]
			}

			columns.forEach((column, columnIndex) => { // 0
				let prevLength = columns[columnIndex].length
				let isColumnRequired = mustBeFilled & (1 << columnIndex)
				columns[columnIndex] = columns[columnIndex].filter((c) => {
					let isCellFilled = c & (1 << index)
					if (isColumnRequired == 0) {
						return true
					} else {
						return isCellFilled
					}
				})
				isColumnRequired = notFilled & (1 << columnIndex)
				columns[columnIndex] = columns[columnIndex].filter((c) => {
					let isCellFilled = c & (1 << index)
					if (isColumnRequired != 0) {
						return true
					} else {
						return !isCellFilled
					}
				})

				count += prevLength - columns[columnIndex].length
			})
		});


		columns.forEach((column, index) => {
			let mustBeFilled = -1
			for (let j = 0; j < column.length; j++) {
				mustBeFilled = mustBeFilled & column[j]
			}
			let notFilled = 0
			for (let j = 0; j < column.length; j++) {
				notFilled = notFilled | column[j]
			}

			rows.forEach((row, rowIndex) => {
				let prevLength = rows[rowIndex].length
				let isRowRequired = mustBeFilled & (1 << rowIndex)
				rows[rowIndex] = rows[rowIndex].filter((r) => {
					let isCellFilled = r & (1 << index)
					if (isRowRequired == 0) {
						return true
					} else {
						return isCellFilled
					}
				})
				isRowRequired = notFilled & (1 << rowIndex)
				rows[rowIndex] = rows[rowIndex].filter((r) => {
					let isCellFilled = r & (1 << index)
					if (isRowRequired != 0) {
						return true
					} else {
						return !isCellFilled
					}
				})
				count += prevLength - rows[rowIndex].length
			})
		})
	}
}

const solveNonogram = (tableEl, nonogramW, nonogramH, hintW, hintH) => {
	const [leftArr, topArr] = populateMatrices(tableEl, nonogramW, nonogramH, hintW, hintH);

	const clueArrLeft = []

	const rows = []
	for (let y = 0; y < nonogramH; ++y) rows.push(generateBinConfig(leftArr[y], nonogramW));

	const columns = []
	for (let x = 0; x < nonogramW; ++x) columns.push(generateBinConfig(topArr[x], nonogramH));

	binFilter(rows, columns);

	let isInvalid = false;
	let hasMultipleSolutions = false;

	if(!isInvalid && !hasMultipleSolutions)
		rows.forEach(row => {
			if (row.length == 0) isInvalid = true;
			if (row.length > 1)  hasMultipleSolutions = true;
		});

	if(!isInvalid && !hasMultipleSolutions)
		columns.forEach(column => {
			if (column.length == 0) isInvalid = true;
			if (column.length > 1)  hasMultipleSolutions = true;
		});

	if(isInvalid) {
		setTableInvalid(isInvalid);
		setTableMulti(false);
	} else {
		setTableMulti(hasMultipleSolutions);
		setTableInvalid(false);
	}

	for (let y = 0; y < nonogramH; ++y)
		for (let x = 0; x < nonogramW; ++x)
			boardSetMark(x, y, false);


	if(!isInvalid && !hasMultipleSolutions) {
		rows.forEach((row, y) => {
			let x = 0;
			while(row) {
				if (row & 1) boardSetMark(x, y, true);
				row >>= 1;
				++x;
			}
		});
	}
}