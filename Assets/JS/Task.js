export class Task{
    
    constructor(id, name, priority = 1, categorisation = 1){
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.categorisation = categorisation;
        this.subTask = new Array();
    }

    // Add Sub Task
    AddSubTask(task) {
        this.subTask.push(task);
    }

}