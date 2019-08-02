class ToDo {
	constructor(obj) {
		this.id = obj.id;
		this.title = obj.title;
		this.urgent = obj.urgent || false;
		this.tasks = obj.tasks || [];
	};

	setLocalStorage() {
		localStorage.setItem('cardArray', JSON.stringify(globalArray));
	};

	deleteFromStorage(cardIndex) {
    globalArray.splice(cardIndex, 1);
    this.setLocalStorage();
  }
};

class Task {
	constructor(obj) {
		this.id = obj.id;
		this.checkBtn = obj.checkBtn || false;
		this.item = obj.item;
	};

	setLocalStorage() {
		localStorage.setItem('tempArray', JSON.stringify(taskArray));
	}
};