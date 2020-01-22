/**
 * @param {Model[]} models
 * @returns {number}
 */
function getLargestId(models) {
    return models.reduce(function(nextId, model) {
        if (nextId >= model.id) {
            return nextId;
        }

        return model.id;
    }, 0);
}

/**
 * @typedef {Object} Model
 * @property {number} id
 */

export class Model {
    constructor({id, ...attributes}, {collection} = {}) {
        this.collection = collection;
        this.id = id;
        this.attributes = {
            ...this.defaults(),
            ...attributes,
            id
        };
    }

    defaults() {
        return {};
    }

    toJSON() {
        return this.attributes;
    }

    save() {
        if (this.collection) {
            this.id = getLargestId(this.collection.models) + 1;
        }

        return Promise.resolve(this);
    }

    set(key, value) {
        this.attributes[key] = value;
    }
}
