import {Model} from './Model';

export class ToDoModel extends Model {
    defaults() {
        return {
            done: false
        };
    }
}
