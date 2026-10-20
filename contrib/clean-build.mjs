import {readdirSync, rmSync} from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const target = process.argv[2];
const outputs = target ? [target] : readdirSync(path.join(root, 'src'));

for (const name of outputs) {
    rmSync(path.resolve(root, name), {recursive: true, force: true});
}
