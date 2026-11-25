import {AddonWrapper} from './AddonWrapper';
import type {FilterFunction, FilterWrapperOptions} from './types';

export class FilterWrapper extends AddonWrapper<FilterFunction> {
    constructor(options: FilterWrapperOptions) {
        super({
            ...options,
            type: 'filters'
        });
    }

    get dependencyInject() {
        const inject = super.dependencyInject;

        return Promise.all([inject, this.instance]).then(function([inject, instance]) {
            return inject.replace(/\n\s*\};$/, `,
              async: ${JSON.stringify(instance.async === true)}
            };`);
        });
    }
}
