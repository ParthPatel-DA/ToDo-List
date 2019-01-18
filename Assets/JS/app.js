// import module
import { Task }  from './Task.js';



// Variable
const TaskData = new Array();
let ID;
let btnAddTask = document.getElementById("AddTask");
let list = document.getElementById('list');
let detail = document.getElementById('detail');
let preID;



// Event Listeners

btnAddTask.addEventListener('blur', AddTask);
btnAddTask.addEventListener('focus', ClearAddTask);
document.addEventListener('DOMContentLoaded', getFromLocalStorage);
list.addEventListener('click', removeViewTask);



// Functions

// Add Task and Sub-Task
function AddTask(e) {
    
    let Data = e.target.value;

    // condition for check textbox has value or not
    if(Data === ""){

        if(e.target.id == "AddTask") {
            e.target.value = '+ Add Task';
        } else {
            e.target.value = '+ Add Sub Task';
        }
        
        e.target.style['color'] = '#00a4ef';
        e.target.style['font-weight'] = 'bold';
        e.target.style['cursor'] = 'pointer';
        
    } else {

        // create new Task
        let task = new Task(genrateKey(), Data);
        
        // check request is for Add Task or Add Sub-Task
        if(e.target.id == "AddTask") {
            
            // Add new Task
            TaskData.push(task);
            e.target.value = '+ Add Task';

        } else {

            TaskData.forEach( t => {
                // find Task id
                if(t.id == e.target.parentNode.parentNode.parentNode.children[0].getAttribute('data-id')){
                    // Add new sub-Task
                    t.subTask.push(task);
                }
            });
            
        }

        // store data in localStorage
        localStorage.setItem('TaskData', JSON.stringify(TaskData));
    }

};

// change style and clear text on textbox focus
function ClearAddTask(e) {
    e.target.value = '';
    e.target.removeAttribute('style');
};

// remove task and subtask, display task detail, check for task complete
function removeViewTask(e){

    // check request is for delete task & sub-task
    if(e.target.classList.contains('fa-trash')) {

        // request is for delete task
        if(e.target.classList.contains("task")) {
            TaskData.some( (task,index) => {

                // find task in the list and remove it form storage
                if(task.id == e.target.parentNode.children[0].getAttribute('data-id')){
                    TaskData.splice(index, 1);
                    return true;
                }
            });
        } else {
            // request is for delete sub-task

            let parentID = e.target.parentNode.parentNode.parentNode.children[0].getAttribute('data-id');
            let childID = e.target.parentNode.children[0].getAttribute('data-id');
            TaskData.some( (task,Tindex) => {

                // find parent task
                if(task.id == parentID){
                    task.subTask.some( (subTask,STindex) => {

                        // find sub-task in the list and remove it from storage
                        if(subTask.id == childID){
                            TaskData[Tindex].subTask.splice(STindex, 1);
                        }
                    });
                }
            });
        }
        
    } else if(e.target.classList.contains('fa-square-o')) {
        // check request is for complete task and sub-task

        // request is for complete task
        if(e.target.classList.contains("task")) {
            TaskData.some( (task,index) => {

                // find task in the list and make complete it from storage
                if(task.id == e.target.parentNode.children[0].getAttribute('data-id')){
                    TaskData[index].isComplete = true;
                    return true;
                }
            });
        } else {
            // request is for complete sub-task

            let parentID = e.target.parentNode.parentNode.parentNode.children[0].getAttribute('data-id');
            let childID = e.target.parentNode.children[0].getAttribute('data-id');
            TaskData.some( (task,Tindex) => {

                // find parent task
                if(task.id == parentID){
                    task.subTask.some( (subTask,STindex) => {

                        // find sub-task in the list and make complete it from storage
                        if(subTask.id == childID){
                            TaskData[Tindex].subTask[STindex].isComplete = true;
                        }
                    });
                }
            });
        }
    } else {
        if(!e.target.classList.contains('txtTask')){
            // display detail of task

            var temp = e.target;

            // find the task-id from DOM
            while(!temp.classList.contains('Task')){
                temp = temp.parentNode;
            }

            TaskData.some(task => {
                if(task.id == temp.children[0].getAttribute('data-id')){
                    
                    // add task detail in the DOM
                    detail.innerHTML = `
                        <header class="Task-Header">
                            <input type="text" id="txtTaskName" value="${ task.name }">
                            <input type="hidden" id="txtTaskID" value="1">
                        </header>
                        <a href="#">Select Category</a>
                        <input type="text" id="txtCategory" list="Category" placeholder="Select Category">
                        <datalist id="Category">
                            <option value="Select Category">
                            <option value="Home">
                            <option value="Office">
                            <option value="Friend">
                        </datalist>
                        <div><textarea id="txtDescription">${ task.description }</textarea></div>
                        <div class="Task-label">
                            <div class="subTask-List" id="subTask-List">
                    `;

                    if(task.subTask.length > 0){
                        detail.innerHTML += '<h3>Sub Tasks List</h3>';
                    }

                    task.subTask.forEach(subTask => {
                        detail.innerHTML += `
                            <div class="subTask">
                                <div class="subTask-Title"><input type="text" id="txtSubTaskTitle" value="${ subTask.name }"></div>
                                <div class="subTask-Detail"><textarea id="txtSubTaskDetail">${ subTask.description }</textarea></div>
                            </div>
                        `;
                    });
                    

                    detail.innerHTML += `
                            </div>
                        </div>
                    `;

                    // hide and show detail div in DOM
                    if(detail['style'].display == 'block' && task.id == preID){
                        detail['style'].display = 'none';
                    } else {
                        detail['style'].display = 'block';
                    }
                    preID = task.id;

                    return true;
                }
            });
        }
        
    }
    localStorage.setItem('TaskData', JSON.stringify(TaskData));
}


function getFromLocalStorage(){
    
    // get data from localStorage
    let temp = JSON.parse(localStorage.getItem('TaskData'));
    // console.log(temp);

    // check data is null or not
    if(temp != null) {
        temp.forEach(task => {
            var tempSubTask =  task['subTask'];
            delete task['subTask'];

            // genrate class instance from json object
            let tempData = Object.assign(new Task(), task);
            
            // add data in DOM element
            let div = document.createElement('div');
            div.setAttribute('class', 'Task');
            
            let tempElement = document.createElement('a');
            tempElement.setAttribute('class', 'fa fa-square-o task');
            tempElement.setAttribute('data-id', tempData.id);
            tempElement.setAttribute('aria-hidden', 'true');
            div.appendChild(tempElement);
            
            tempElement = document.createElement('label');
            tempElement.textContent = tempData.name;
            div.appendChild(tempElement);

            tempElement = document.createElement('a');
            tempElement.setAttribute('style', 'float: right; margin-right: 10px; color: #9b0000;');
            tempElement.setAttribute('class', 'fa fa-trash task');
            div.appendChild(tempElement);

            // tempElement = document.createElement('div');

            let innerDiv = document.createElement('div');
            innerDiv.setAttribute('class', 'sub-Task');

            tempSubTask.forEach( subTask => {
                // add all sub-task in DOM element

                let div = document.createElement('div');
                let tempSubData = Object.assign(new Task(), subTask);
                tempData.AddSubTask(tempSubData);

                // if sub-task is completed then continue loop
                if(tempSubData.isComplete == true)
                    return;
                
                let tempElement = document.createElement('a');
                tempElement.setAttribute('class', 'fa fa-square-o'); // fa-check-square
                tempElement.setAttribute('data-id', tempSubData.id);
                tempElement.setAttribute('aria-hidden', 'true');
                div.appendChild(tempElement);
            
                tempElement = document.createElement('label');
                tempElement.textContent = tempSubData.name;
                div.appendChild(tempElement);

                tempElement = document.createElement('a');
                tempElement.setAttribute('style', 'float: right; margin-right: 10px; color: #9b0000;');
                tempElement.setAttribute('class', 'fa fa-trash');
                div.appendChild(tempElement);

                innerDiv.appendChild(div);
                
                            
            });

            TaskData.push(tempData);

            // if task is completed then continue loop
            if(tempData.isComplete == true)
                return;

            let txtDiv = document.createElement('div');
            
            tempElement = document.createElement('a');
            tempElement.setAttribute('href', '#');
            txtDiv.appendChild(tempElement);

            tempElement = document.createElement('input');
            tempElement.type = 'text';
            tempElement.setAttribute('class', 'txtTask');
            tempElement.value = '+ Add Sub Task';
            tempElement.setAttribute('placeholder', '+ Add Sub Task')
            tempElement.addEventListener('focus', ClearAddTask);
            tempElement.addEventListener('blur', AddTask);
            txtDiv.appendChild(tempElement);

            innerDiv.appendChild(txtDiv);

            div.appendChild(innerDiv);
            
            list.appendChild(div);

            
            
        });
    }

}

function genrateKey(){

    // get lastID from localStorage
    let lastID = localStorage.getItem('ID');

    // check lastID is null or not, if null then initialize with '1', increment ID otherwise
    if(lastID == null)
        ID = 1;
    else {
        ID = Number(lastID);
        ++ID;
    }
    
    // store ID in localStorage
    localStorage.setItem('ID', String(ID));

    // return ID
    return ID;
}


// auto scaling testarea
var textarea = document.getElementsByTagName('textarea');
for (var i = 0; i < textarea.length; i++) {
  textarea[i].setAttribute('style', 'height:' + (textarea[i].scrollHeight) + 'px;overflow-y:hidden;');
  textarea[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
}


/* <div class="Task">
    <a class="fa fa-square-o" data-id="1" aria-hidden="true"></a>
    <label>Task 1</label>
    <div class="sub-Task">
        <div><a class="fa fa-check-square" data-id="2" aria-hidden="true"></a><label>Sub Task 1</label></div>
        <div><a href="#"><input class="txtTask" type="text" value="+ Add Sub Task" placeholder="+ Add Task"></a></div>
    </div>
</div> */



        // let temp = JSON.parse(data);
        // console.log(temp);
        // temp.forEach(element => {
        //     // let tempData = Task.from(element);
        //     var tempele =  element['subTask'];
        //     delete element['subTask'];
        //     let tempData = Object.assign(new Task(), element);
        //     tempele.forEach(e => {
        //         tempData.AddSubTask(Object.assign(new Task(), e));
        //     });
        //     TaskData.push(tempData);
        // });



                    // <h3>Sub Task</h3>
                    // <a href="#">+ Add Sub Task</a>
                    // <div class="subTask">
                    //     <div class="subTask-Title">Sub Task 1</div>
                    //     <div class="subTask-Detail">Detail</div>
                    // </div>
                    // <div class="subTask">
                    //     <div class="subTask-Title">Sub Task 2</div>
                    //     <div class="subTask-Detail">Detail</div>
                    // </div>