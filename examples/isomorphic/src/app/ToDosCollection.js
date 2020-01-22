import {Collection} from '../awesome-abstractions/Collection';
import {ToDoModel} from './ToDoModel';

export class ToDosCollection extends Collection {
    constructor(models, options) {
        super(models, {
            ...options,
            model: ToDoModel
        });
    }
}
