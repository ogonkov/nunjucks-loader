import {Model} from './Model';

export class Collection {
    constructor(models = [], options = {}) {
        this.model = options.model || Model;
        this.models = [];
        this.models = this.add([...models]);
    }

    toJSON() {
        return this.models.map((model) => model.toJSON());
    }

    add(models) {
        const newModels = [].concat(models).map((model) => (
            new this.model(model, {
                collection: this
            })
        ));

        this.models.push.apply(this.models, newModels);

        return newModels.length === 1 ? newModels[0] : newModels;
    }

    get(obj) {
        return this.models.find((model) => model.id === obj)
    }
}
