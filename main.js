var globalArray = JSON.parse(localStorage.getItem('cardArray')) || [];
var taskCardDisplay = document.querySelector('.task_card-display');
var navTaskTitleInput = document.querySelector('.nav_task-title-input')
var navTaskItemInput = document.querySelector('.nav_task-item-input');
var navMakeTaskList = document.querySelector('.nav_make-task-list');

navMakeTaskList.addEventListener('click', pressSaveBtn);
taskCardDisplay.addEventListener('click', cardEventHandler);
window.addEventListener('load', pageLoad);

function pageLoad(){
	persistedCards();
	reinstantiateCard();
};

function cardEventHandler(event) {
	if (event.target.classList.contains('task_card-delete')) {
    deleteCard(event);
  };
}

function makeNewCard() {
	var todo = new ToDo ({
		id: Date.now(),
		title: navTaskTitleInput.value,
		tasks: navTaskItemInput.value
	})
	globalArray.push(todo);
	displayNewCard(todo);
	todo.setLocalStorage(globalArray);
};

function persistedCards(){
  for (var i = 0; i < globalArray.length; i++){
    var id = globalArray[i].id;
    var title = globalArray[i].title;
    var urgent = globalArray[i].urgent;
    var tasks = globalArray[i].tasks;
    var index = i;
    reassignClass(id,title,urgent,tasks,i);
  };
};

function reassignClass(id,title,urgent,tasks,i){
  var todo = new ToDo({
    id: id,
    title: title,
		urgent: urgent,
		tasks: tasks  
  });
  globalArray.splice(i, 1, todo);
};

function reinstantiateCard(){
  globalArray.forEach(function(todo){
    displayNewCard(todo);
  }); 
};

function displayNewCard(todo) {
	taskCardDisplay.insertAdjacentHTML('afterbegin', `
		<section class="task_card-id" data-id=${todo.id}>
			<container class="task_card-title-container">
				<h2 class="task_card-title">${todo.title}</h2>
			</container>	
			<container class="task_card-task-container">
				<button class="task_card-check" type="button"></button>
				<p class="task_card-task">${todo.tasks}</p>
			</container>
			<container class="task_card-footer-container">	
				<button class="task_card-urgent" type="button">Urgent</button>
				<button class="task_card-delete" type="button">Delete</button>
			</container>	
		</section>`)
}


function pressSaveBtn(event) {
		event.preventDefault();
		if (event.target.classList.contains('nav_make-task-list')) {
		makeNewCard();
	}
}

function findIndex(event) {
  var id = findID(event);
  for (var i = 0; i < globalArray.length; i++) {
    if (id === globalArray[i].id) {
      return parseInt(i);
    };
  };
};

function findID(event) {
  return parseInt(event.target.closest('.task_card-id').dataset.id);
};

function deleteCard(event) {
  var cardIndex = findIndex(event);
  if (event.target.classList.contains('task_card-delete')) {
    event.target.parentNode.parentNode.remove();
    globalArray[cardIndex].deleteFromStorage(cardIndex);
  };
};