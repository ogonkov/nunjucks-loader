import Compiler from 'webpack/lib/Compiler';

import {statsCompiler} from './stats-compiler';

let compiler;
let shutdown;

beforeEach(() => {
    shutdown = false;
    const run = Compiler.prototype.run;
    jest.spyOn(Compiler.prototype, 'run').mockImplementation(function(callback) {
        compiler = this;
        compiler.hooks.shutdown.tap('test', () => { shutdown = true; });
        return run.call(this, callback);
    });
});

afterEach(async () => {
    jest.restoreAllMocks();
    if (compiler && !shutdown) {
        await new Promise((resolve, reject) => compiler.close(error => error ? reject(error) : resolve()));
    }
    compiler = undefined;
});

test('closes the compiler before resolving a successful compilation', async () => {
    const {stats} = await statsCompiler('fixtures/globals/globals.js');
    expect(stats.hasErrors()).toBe(false);
    expect(shutdown).toBe(true);
});

test('closes the compiler before resolving compilation errors', async () => {
    const {stats} = await statsCompiler('fixtures/missing-template.njk');
    expect(stats.hasErrors()).toBe(true);
    expect(shutdown).toBe(true);
});

test('closes the compiler before rejecting fatal compilation errors', async () => {
    const run = Compiler.prototype.run.getMockImplementation();
    Compiler.prototype.run.mockImplementation(function(callback) {
        this.hooks.beforeRun.tap('test', () => { throw new Error('fatal compilation'); });
        return run.call(this, callback);
    });
    await expect(statsCompiler('fixtures/globals/globals.js')).rejects.toThrow('fatal compilation');
    expect(shutdown).toBe(true);
});

test('rejects compiler shutdown errors', async () => {
    const run = Compiler.prototype.run.getMockImplementation();
    Compiler.prototype.run.mockImplementation(function(callback) {
        this.hooks.shutdown.tap({name: 'failure', stage: 1}, () => { throw new Error('shutdown failed'); });
        return run.call(this, callback);
    });
    await expect(statsCompiler('fixtures/globals/globals.js')).rejects.toThrow('shutdown failed');
});
