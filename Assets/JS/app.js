

import { Task }  from './Task.js';

const TaskData = new Array();
let ID;

// Variable
let btnAddTask = document.getElementById("AddTask");
let list = document.getElementById('list');

// Event Listeners

btnAddTask.addEventListener('blur', AddTask);
btnAddTask.addEventListener('focus', ClearAddTask);
// btnAddSubTaskList.addEventListener('focus', ClearAddTask);
document.addEventListener('DOMContentLoaded', getFromLocalStorage);
list.addEventListener('click', removeViewTask);





// Functions

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
        let task = new Task(genrateKey(), Data);
        if(e.target.id == "AddTask") {
            TaskData.push(task);
            e.target.value = '+ Add Task';
        } else {
            TaskData.forEach( t => {
                console.log("sd");
                if(t.id == e.target.parentNode.parentNode.parentNode.children[0].getAttribute('data-id')){
                    t.subTask.push(task);
                }
            });
            
        }
        localStorage.setItem('TaskData', JSON.stringify(TaskData));
    }

};

function ClearAddTask(e) {
    e.target.value = '';
    e.target.removeAttribute('style');
};

function removeViewTask(e){
    if(e.target.classList.contains('fa-trash')){
        if(e.target.classList.contains("task")){
            TaskData.some( (task,index) => {
                if(task.id == e.target.parentNode.children[0].getAttribute('data-id')){
                    // console.log(index);
                    // delete TaskData[index];
                    TaskData.slice(index, 1);
                    return true;
                }
            });
        } else {

        }
        localStorage.setItem('TaskData', JSON.stringify(TaskData));
    }
}


function getFromLocalStorage(){
    
    let temp = JSON.parse(localStorage.getItem('TaskData'));
    // console.log(temp);
    if(temp != null) {
        temp.forEach(task => {
            // let tempData = Task.from(task);
            var tempSubTask =  task['subTask'];
            delete task['subTask'];
            let tempData = Object.assign(new Task(), task);
            

            let div = document.createElement('div');
            div.setAttribute('class', 'Task');
            
            let tempElement = document.createElement('a');
            tempElement.setAttribute('class', 'fa fa-square-o');
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

                let div = document.createElement('div');
                let tempSubData = Object.assign(new Task(), subTask);
                tempData.AddSubTask(tempSubData);
                
                let tempElement = document.createElement('a');
                tempElement.setAttribute('class', 'fa fa-check-square');
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

            TaskData.push(tempData);
        });
    }

}

function genrateKey(){
    if(localStorage.getItem('ID') == null)
        ID = 1;
    else {
        ID = Number(localStorage.getItem('ID'));
        ++ID;
    }
    localStorage.setItem('ID', String(ID));
    return ID;
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