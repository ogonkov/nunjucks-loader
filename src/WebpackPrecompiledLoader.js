export function WebpackPrecompiledLoader(precompiled = {}) {
    this.precompiled = precompiled;
}

WebpackPrecompiledLoader.prototype.getSource = function getSource(name) {
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
};
