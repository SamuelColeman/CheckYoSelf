var globalArray = JSON.parse(localStorage.getItem('cardArray')) || [];
var taskArray = JSON.parse(localStorage.getItem('tempArray')) || [];
var taskCardDisplay = document.querySelector('.task__card_display');
var navTaskTitleInput = document.querySelector('.nav__task_title_input')
var navTaskItemInput = document.querySelector('.nav__task_item_input');
var navMakeTaskBtn = document.querySelector('.nav__make_task_btn');
var navTaskList = document.querySelector('.nav__task_list');
var navTaskItemBtn = document.querySelector('.nav__task_item_btn');
var navExitBtn = document.querySelector('.nav__exit_btn');
var inputs = document.querySelectorAll('.input');
var navClearBtn = document.querySelector('.nav__clear_btn');

navMakeTaskBtn.addEventListener('click', pressSaveBtn);

taskCardDisplay.addEventListener('click', cardEventHandler);
navTaskItemBtn.addEventListener('click', createTaskList);
navTaskList.addEventListener('click', taskEventHandler);
window.addEventListener('load', pageLoad);
checkInputFields();

function pageLoad(){
	persistedCards();
	reinstantiateCard();
	cardPlaceholder();
	disableBtn();
};

function cardEventHandler(event) {
	if (event.target.classList.contains('task__card_delete_icon')) {
    deleteCard(event);
  };
}

function taskEventHandler(event) {
	if (event.target.classList.contains('nav__exit_icon')) {
    deleteTask(event);
  };
}

function cardPlaceholder() {
  if (globalArray.length < 1) {
    document.querySelector('.task__card_placeholder').hidden = false;
  } else {
    document.querySelector('.task__card_placeholder').hidden = true;
  }
};

function makeNewCard() {
	var todo = new ToDo ({
		id: Date.now(),
		title: navTaskTitleInput.value,
		tasks: taskArray
	})
	globalArray.push(todo);
	displayNewCard(todo);
	todo.setLocalStorage(globalArray);
};

function createTaskList() {
	var task = new Task ({
		id: Date.now(),
		checkBtn: false,
		item: navTaskItemInput.value
	})
	taskArray.push(task)
	displayNewTask(task)
}

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

function newTask(tasks) {
	var newTaskList = '';
	for (var i = 0; i < tasks.length; i++) {
			newTaskList += `<li class="card__task" data-id=${tasks.id}>
				<button class="task__card_check" type="button"><img class="task__card_check_icon" src="icons/checkbox.svg"></button>
				<p>${tasks[i].item}</p> 
			`
	}
	return newTaskList; 
}

function displayNewCard(todo) {
	taskCardDisplay.insertAdjacentHTML('afterbegin', `
		<section class="task__card_id" data-id=${todo.id}>
			<container class="task__card_title_container">
				<h2 class="task__card_title">${todo.title}</h2>
			</container>	
			<container class="task__card_task_container">
				<ul class="task__card_task">${newTask(todo.tasks)}</ul>
			</container>
			<container class="task__card_footer_container">	
				<button class="task__card_urgent" type="button"><img class="task__card_urgent_icon" src="icons/urgent.svg"><p class="urgent__text">Urgent</p></button>
				<button class="task__card_delete" type="button"><img class="task__card_delete_icon" src="icons/delete.svg"><p class="delete__text">Delete</p></button>
			</container>	
		</section>`)
}

function displayNewTask(task) {
	if (navTaskItemInput.value !== '') {
	navTaskList.insertAdjacentHTML('afterbegin', `
		<section class="nav__temp_section" data-id=${task.id}>
			<container class="nav__temp_container">
				<button class="nav__exit_btn" type="button">
					<img class="nav__exit_icon" src="icons/delete.svg">
				</button>
				<p class="nav__temp_task type="text">${task.item}</p>
			</container>
		</section>
		`)
	}
	navTaskItemInput.value = '';
}

function pressSaveBtn(event) {
		event.preventDefault();
		if (event.target.classList.contains('nav__make_task_btn')) {
			makeNewCard();
	}
		cardPlaceholder();
		disableBtn();
		navTaskTitleInput.value = '';
}

function findIndex(event) {
  var id = findID(event);
  for (var i = 0; i < globalArray.length; i++) {
    if (id === globalArray[i].id) {
      return parseInt(i);
    }
  }
};

function findID(event) {
  return parseInt(event.target.closest('.task__card_id').dataset.id);
};

function deleteCard(event) {
  var cardIndex = findIndex(event);
  if (event.target.classList.contains('task__card_delete_icon')) {
    event.target.parentNode.parentNode.parentNode.remove();
    globalArray[cardIndex].deleteFromStorage(cardIndex)
  }
  cardPlaceholder();
};

function findTaskID(event) {
	return parseInt(event.target.closest('.nav__temp_section').dataset.id);
};

function findTaskIndex(event) {
  var id = findTaskID(event);
  for (var i = 0; i < globalArray.length; i++) {
    if (id === taskArray[i].id) {
      return parseInt(i);
    }
  }
};

function deleteTask(event) {
  var cardTaskIndex = findTaskIndex(event);
  if (event.target.classList.contains('nav__exit_icon')) {
    event.target.parentNode.parentNode.remove();
  }
};

function disableBtn() {
  if (navTaskItemInput.value === '' &&
    taskArray.length < 1) {
    navMakeTaskBtn.disabled = true;
  } else {
    navMakeTaskBtn.disabled = false;
  }
};

function checkInputFields() {
  for (i=0; i < inputs.length; i++) {
    inputs[i].addEventListener('keyup', function () {
      disableBtn();
    })
  }
};