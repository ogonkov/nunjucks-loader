import initialState from './initial-state.json';
import newItemTpl from './new-item.njk';
import itemsTpl from '../django_project/example_app_a/templates/todos-items.njk';
import {ToDosCollection} from './ToDosCollection';

const todos = new ToDosCollection([...initialState.todos]);

const UI = {
    toolbar: document.querySelector('[data-ui-area="toolbar"]'),
    todos: document.querySelector('[data-ui-area="todos"]')
};

UI.toolbar.addEventListener('click', function(event) {
    if (event.target.name === 'add-task') {
        const newItem = newItemTpl({
            id: `new-item-${Math.random()}`
        });

        UI.todos.insertAdjacentHTML('beforeend', newItem);
    }
});

UI.todos.addEventListener('change', function(event) {
    if (event.target.name === 'todos') {
        const id = Number(event.target.value);
        const model = todos.get(id);

        model.set('done', event.target.checked);
    }
});

UI.todos.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !!event.target.value) {
        const model = todos.add({
            text: event.target.value
        });

        model.save().then(function() {
            UI.todos.innerHTML = (itemsTpl({
                state: {
                    todos: todos.toJSON()
                }
            }));
        });
    }
});
