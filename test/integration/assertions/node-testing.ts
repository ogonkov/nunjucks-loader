import {test as nodeTest} from 'node:test';

import type {Test} from './types.js';

// Node binds TestContext as `this`, but @types/node omits it from TestFn.
export const test: Test = nodeTest;
export {describe} from 'node:test';
export {test as it};
