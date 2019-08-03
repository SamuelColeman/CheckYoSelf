var globalArray = JSON.parse(localStorage.getItem('cardArray')) || [];
var taskArray = [];
var taskCardDisplay = document.querySelector('.task__card_display');
var navTaskTitleInput = document.querySelector('.nav__task_title_input')
var navTaskItemInput = document.querySelector('.nav__task_item_input');
var navMakeTaskBtn = document.querySelector('.nav__make_task_btn');
var navTaskList = document.querySelector('.nav__task_list');
var navTaskItemBtn = document.querySelector('.nav__task_item_btn');
var navExitBtn = document.querySelector('.nav__exit_btn');
var navClearBtn = document.querySelector('.nav__clear_btn'); 

navMakeTaskBtn.addEventListener('click', pressSaveBtn);
navClearBtn.addEventListener('click', clearAll)
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
  }
  if (event.target.classList.contains('task__card_check_icon')) {
  	checkOffTask(event);
  }
};

function taskEventHandler(event) {
	if (event.target.classList.contains('nav__exit_icon')) {
    deleteTask(event);
  }
};

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
	if (navTaskItemInput.value !== '') {
	var task = new Task ({
		id: Date.now(),
		checkBtn: false,
		item: navTaskItemInput.value
	})
	taskArray.push(task);
	displayNewTask(task);
	}
};

function persistedCards(){
  for (var i = 0; i < globalArray.length; i++){
    var id = globalArray[i].id;
    var title = globalArray[i].title;
    var urgent = globalArray[i].urgent;
    var tasks = globalArray[i].tasks;
    var index = i;
    reassignClass(id,title,urgent,tasks,i);
  }
};

function reassignClass(id,title,urgent,tasks,i){
  var todo = new ToDo({
    id: id,
    title: title,
		urgent: urgent,
		tasks: tasks  
  })
  globalArray.splice(i, 1, todo);
};

function reinstantiateCard(){
  globalArray.forEach(function(todo){
    displayNewCard(todo);
  }) 
};

function newTask(tasks) {
	var newTaskList = '';
	var btnStatus = '';
	var italic = '';
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].checkBtn === true) {
			btnStatus = 'icons/checkbox-active.svg';
			italic = 'card__task_italic';
		} else {
			btnStatus = 'icons/checkbox.svg';
			italic = '';
		}
			newTaskList += `<li class="card__task ${italic}" data-id=${tasks[i].id}>
				<button class="task__card_check" type="button"><img class="task__card_check_icon" src=${btnStatus} alt="Checked or unchecked circle icon"></button>
				<p class="task__list_item">${tasks[i].item}</p>`
	}
	return newTaskList; 
};

function displayNewCard(todo) {
	var deleteBtn = '';
	for (var i = 0; i < todo.length; i++) {
		if (todo[i].checked === true) {
			deleteBtn = 'icons/delete.svg';
		} else {
			deleteBtn = 'icons/delete-active.svg';
		}
	}
	taskCardDisplay.insertAdjacentHTML('beforeend', `
		<section class="task__card_id" data-id=${todo.id}>
			<container class="task__card_title_container">
				<h2 class="task__card_title">${todo.title}</h2>
			</container>	
			<container class="task__card_task_container">
				<ul class="task__card_task">${newTask(todo.tasks)}</ul>
			</container>
			<container class="task__card_footer_container">	
				<button class="task__card_urgent" type="button"><img class="task__card_urgent_icon" src="icons/urgent.svg" alt="Lighting bolt urgent icon"><p class="urgent__text">URGENT</p></button>
				<button class="task__card_delete" type="button"><img class="task__card_delete_icon" src=${deleteBtn} alt="Cross mark delete icon"><p class="delete__text">DELETE</p></button>
			</container>	
		</section>`)
	clearAll();
};

function displayNewTask(task) {
	if (navTaskItemInput.value !== '') {
	navTaskList.insertAdjacentHTML('beforeend', `
		<section class="nav__temp_section" data-id=${task.id}>
			<container class="nav__temp_container">
				<button class="nav__exit_btn" type="button">
					<img class="nav__exit_icon" src="icons/delete.svg" alt="X mark delete icon">
				</button>
				<p class="nav__temp_task type="text">${task.item}</p>
			</container>
		</section>
		`)
	}
	disableBtn();
	navTaskItemInput.value = '';
};

function pressSaveBtn(event) {
		event.preventDefault();
		if (event.target.classList.contains('nav__make_task_btn')) {
			makeNewCard();
	}
		cardPlaceholder();
		navTaskTitleInput.value = '';
		disableBtn();
};

function findIndex(event, globalArray, className) {
  var id = parseInt(event.target.closest('.' + className).dataset.id);
  for (var i = 0; i < globalArray.length; i++) {
    if (id === globalArray[i].id) {
      return parseInt(i);
    }
  }
};

function deleteCard(event) {
  var cardIndex = findIndex(event, globalArray, 'task__card_id');
    event.target.parentNode.parentNode.parentNode.remove();
    globalArray[cardIndex].deleteFromStorage(cardIndex)
  cardPlaceholder();
};

function deleteTask(event) {
	var id = findIndex(event, taskArray, 'nav__temp_section');
  event.target.parentNode.parentNode.remove();
  taskArray.splice(id, 1);
};

function disableBtn() {
  if (navTaskTitleInput.value === '' ||
    taskArray.length < 1) {
    navMakeTaskBtn.disabled = true;
  	navClearBtn.disabled = true;
  } else {
    navMakeTaskBtn.disabled = false;
    navClearBtn.disabled = false;
  }
};

function checkInputFields() {
	var inputs = document.querySelectorAll('.input');
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('keyup', function () {
      disableBtn();
    })
  }
};

function clearAll() {
	navTaskTitleInput.value = '';
	navTaskItemInput.value = '';
	navTaskList.innerHTML = '';
	taskArray = [];
	disableBtn();
};

function checkOffTask(event) {
	var globalID = findIndex(event, globalArray, 'task__card_id');
	var ID = findIndex(event, globalArray[globalID].tasks, 'card__task')
	var selectedTask = globalArray[globalID].tasks[ID];
	selectedTask.checkBtn = ! selectedTask.checkBtn
	updateTask(event, selectedTask, ID);
	globalArray[globalID].setLocalStorage(globalArray);
	toggleItalic(event);
	checkTaskCompletion(event, globalArray, globalArray[globalID]);
};

function updateTask(event, task, ID) {
	var checkBtnArray = event.target.closest('.task__card_id').querySelectorAll('.task__card_check_icon')
	if (task.checkBtn === true) {
		checkBtnArray[ID].setAttribute('src', 'icons/checkbox-active.svg')
	} else {
		checkBtnArray[ID].setAttribute('src', 'icons/checkbox.svg')
	}
};

function toggleItalic(event) {
	event.target.closest('.card__task').classList.toggle('card__task_italic');
};

function checkTaskCompletion(event, array, obj) {
	var checkDelete = event.target.closest('.task__card_id').querySelector('.task__card_delete_icon');
	if (obj.tasks.every(function(item) {
		return item.checkBtn === true;
	})) {
		checkDelete.disabled = false;
		obj.checked = true;
		checkDelete.setAttribute('src', 'icons/delete.svg')
	} else {
		checkDelete.disabled = true;
		obj.checked = false;
		checkDelete.setAttribute('src', 'icons/delete-active.svg')
	}
}