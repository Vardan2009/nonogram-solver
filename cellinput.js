const populateCellInputs = () => {
	document.querySelectorAll("th.hint input").forEach(el => {
		el.addEventListener("keydown", e => {
			e.preventDefault();
			if (e.key >= '0' && e.key <= '9') {
				el.value += e.key;
				onBoardCellsChanged()
			}
			else if (e.keyCode == 8) {
				el.value = el.value.slice(0,-1);
				onBoardCellsChanged()
			}
		})
	})

	const inputs = mainTable.querySelectorAll("input");

	document.addEventListener('keydown', (event) => {
		const activeElement = document.activeElement;

		if (activeElement && activeElement.tagName === 'INPUT') {
			const currentIndex = Array.from(inputs).indexOf(activeElement);

			let nextIndex;

			const isInLefts = currentIndex >= (lastNonogramWidth + lastHintWidth) * lastHintHeight - (lastHintWidth * lastHintHeight);

			switch (event.key) {
			case 'ArrowUp':
				nextIndex = currentIndex - (isInLefts ? lastHintWidth : lastNonogramWidth);
				break;
			case 'ArrowDown':
				nextIndex = currentIndex + (isInLefts ? lastHintWidth : lastNonogramWidth);
				break;
			case 'ArrowLeft':
				nextIndex = currentIndex - 1;
				break;
			case 'ArrowRight':
				nextIndex = currentIndex + 1;
				break;
			default:
				return;
			}

			if (nextIndex >= 0 && nextIndex < inputs.length) {
				inputs[nextIndex].focus();
			}
		}
	});
}