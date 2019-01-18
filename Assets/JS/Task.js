export class Task{
    
    constructor(id, name, priority = 1, categorisation = 1){
        this.id = id;
        this.name = name;
        this.description = 'none';
        this.priority = priority;
        this.categorisation = 'Select Category';
        this.subTask = new Array();
        this.isComplete = false;
    }

    // Add Sub Task
    AddSubTask(task) {
        this.subTask.push(task);
    }

}