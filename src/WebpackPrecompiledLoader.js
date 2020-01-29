export function WebpackPrecompiledLoader(precompiled = {}, {isWindows} = {}) {
    this.precompiled = precompiled;
    this.isWindows = isWindows;
}

WebpackPrecompiledLoader.prototype.getSource = function getSource(name) {
    // For some strange reason all precompiled templates get leading slashes
    // on Windows, while templates have it without it
    const windowsIdentifier = `/${name}`;
    if (!(name in this.precompiled) && this.isWindows && !(windowsIdentifier in this.precompiled)) {
        return null;
    }

    return {
        src: {
            type: 'code',
            obj: this.precompiled[name] || this.isWindows && this.precompiled[windowsIdentifier]
        },
        path: name
    };
};
