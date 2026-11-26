import {createRequire} from 'node:module';
import path from 'node:path';

import {statsCompiler} from './stats-compiler';


export default async (fixture, options = {}) => {
    const {stats, outputFileSystem, bundlePath} = await statsCompiler(fixture, options);

    if (stats.hasErrors()) {
        const [error] = stats.toJson().errors;
        const errorCopy = new Error(error.message);

        Object.entries(error).forEach(([k, v]) => {
            errorCopy[k] = v;
        });

        throw errorCopy;
    }

    const modules = new Map();

    function load(filename) {
        if (modules.has(filename)) return modules.get(filename).exports;
        const module = {exports: {}};
        modules.set(filename, module);
        const nativeRequire = createRequire(filename);
        const require = request => {
            const dependency = path.resolve(path.dirname(filename), request);
            return request.startsWith('.') && outputFileSystem.existsSync(dependency)
                ? load(dependency)
                : nativeRequire(request);
        };
        // Execute in Jest's context so the bundle uses its fake timers.
        const execute = new Function('module', 'exports', 'require', '__filename', '__dirname',
            outputFileSystem.readFileSync(filename, 'utf8'));
        try {
            execute(module, module.exports, require, filename, path.dirname(filename));
        } catch (error) {
            modules.delete(filename);
            throw error;
        }
        return module.exports;
    }

    const module = load(bundlePath);
    return module.default || module;
}
