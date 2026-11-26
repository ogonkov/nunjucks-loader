import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

let root;

function git(...args) {
    const result = spawnSync('git', args, {cwd: root, encoding: 'utf8'});
    if (result.status !== 0) throw new Error(result.stderr || String(result.error));
}

beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'nunjucks-clean-guard-'));
    // Git for Windows may check shell scripts out with CRLF line endings.
    for (const name of ['git-check-branch-is-clean.sh', 'git-utils.sh']) {
        writeFileSync(path.join(root, name), readFileSync(path.resolve(__dirname, '../contrib', name), 'utf8').replace(/\r\n/g, '\n'));
    }
    git('init');
    git('config', 'user.name', 'Test');
    git('config', 'user.email', 'test@example.com');
    git('config', 'commit.gpgsign', 'false');
    writeFileSync(path.join(root, 'tracked'), 'original\n');
    git('add', '.');
    git('commit', '-m', 'baseline');
});

afterEach(() => rmSync(root, {recursive: true, force: true}));

test('accepts unchanged content after an mtime change and rejects real changes', () => {
    const check = () => spawnSync('sh', [path.join(root, 'git-check-branch-is-clean.sh')], {cwd: root, encoding: 'utf8'}).status;
    expect(check()).toBe(0);
    const tracked = path.join(root, 'tracked');
    const stat = statSync(tracked);
    utimesSync(tracked, stat.atime, new Date(stat.mtimeMs + 10000));
    expect(check()).toBe(0);
    writeFileSync(tracked, 'changed\n');
    expect(check()).toBe(1);
    git('add', '.');
    expect(check()).toBe(1);
    writeFileSync(tracked, 'original\n');
    expect(check()).toBe(1);
    git('reset', '--hard', 'HEAD');
    writeFileSync(path.join(root, 'untracked'), 'new');
    expect(check()).toBe(2);
});
