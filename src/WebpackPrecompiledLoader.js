export function WebpackPrecompiledLoader(precompiled = {}, {isWindows} = {}) {
    this.precompiled = precompiled;
    this.isWindows = isWindows;
}

WebpackPrecompiledLoader.prototype.getSource = function getSource(name) {
    // For some strange reason all precompiled templates get leading slashes
    // on Windows, while templates sometimes have it without it
    const id = this.isWindows && !name.startsWith('/') ? `/${name}` : name;
    if (!(id in this.precompiled)) {
        return null;
    }

    return {
        src: {
            type: 'code',
            obj: this.precompiled[id]
        },
        path: name
    };
};
