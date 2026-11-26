import {execFileSync} from 'node:child_process';
import {copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

import packageJson from '../package.json' with {type: 'json'};

const root = path.resolve(import.meta.dirname, '..');
const temporary = mkdtempSync(path.join(tmpdir(), 'nunjucks-package-'));
const consumer = path.join(temporary, 'consumer');

function npm(args, cwd) {
    execFileSync(process.execPath, [process.env.npm_execpath, ...args], {cwd, stdio: 'inherit'});
}

try {
    npm(['pack', '--pack-destination', temporary], root);
    const archive = readdirSync(temporary).find(name => name.endsWith('.tgz'));
    mkdirSync(consumer);
    writeFileSync(path.join(consumer, 'package.json'), JSON.stringify({private: true}));
    npm(['install', '--ignore-scripts', '--no-audit', '--no-fund',
        path.join(temporary, archive),
        `webpack@${packageJson.devDependencies.webpack}`,
        `nunjucks@${packageJson.devDependencies.nunjucks}`
    ], consumer);
    copyFileSync(path.join(root, 'contrib/package-consumer.cjs'), path.join(consumer, 'smoke.cjs'));
    execFileSync(process.execPath, ['smoke.cjs'], {cwd: consumer, stdio: 'inherit'});
} finally {
    rmSync(temporary, {recursive: true, force: true});
}
