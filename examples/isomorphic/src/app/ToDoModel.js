import {Model} from '../awesome-abstractions/Model';

export class ToDoModel extends Model {
    defaults() {
        return {
            done: false
        };
    }
}
