import {Collection} from './Collection';
import {ToDoModel} from './ToDoModel';

export class ToDosCollection extends Collection {
    constructor(models, options) {
        super(models, {
            ...options,
            model: ToDoModel
        });
    }
}
