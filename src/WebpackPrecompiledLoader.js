export default class WebpackPrecompiledLoader {
    constructor(precompiled = {}) {
        this.precompiled = precompiled;
    }

    getSource(name) {
        if (!(name in this.precompiled)) {
            return null;
        }

        return {
            src: {
                type: 'code',
                obj: this.precompiled[name]
            },
            path: name
        };
    }
}

