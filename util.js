const playAnim = (el, className) => {
	el.classList.remove(className);
	setTimeout(() => el.classList.add(className), 20)
}