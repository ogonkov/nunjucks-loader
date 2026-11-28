# Package integration

Pack once, then test that tarball in CommonJS and ESM consumer
projects. Each project's native Webpack config builds the shared `test/fixtures`
with both values of the loader's `esModule` option. The migrated
`assertions/loader.test.ts` and `assertions/assets.test.ts` run every original case
against both modes, including globals, extensions, filters, assets, Jinja syntax,
and compilation warnings.

Expected HTML under `expected/` preserves the rendered
string values from the original Jest snapshots. Line endings are normalized for
comparison; expectations are ordinary reviewable HTML files.
`expect(value, this).toMatchSnapshot()` compares synchronous output;
`.resolves.toMatchSnapshot()` awaits asynchronous output. Both derive the filename
from the full test name, excluding the loader-mode suffix so all four variants
share expectations. Webpack's CLI writes
`dist/stats.json` for the dynamic-template warning assertions.

An explicit CI step copies the shared fixtures into each consumer’s `test/fixtures`. Their package manifest keeps the fixture JavaScript in CommonJS mode,
including inside the ESM consumer. The build then runs Webpack followed by `tsc`. Its `tsconfig.json` extends
shared settings and selects CommonJS or ES2022 modules. Tests are emitted to
`tests/*.test.js`, where the consumer's package type determines how Node loads
them. CommonJS uses emitted `require()` calls; ESM preserves `import` statements.
Webpack exports the template function directly in both loader modes. The package
import mapping `#dist/*` points at generated bundles under `dist/`; a single
`assertions/dist.d.ts` declaration describes their template function exports.

Run locally from the repository root:

```sh
npm pack
mkdir -p test/integration/consumers/cjs/test/fixtures test/integration/consumers/esm/test/fixtures
cp -R test/fixtures/. test/integration/consumers/cjs/test/fixtures/
cp -R test/fixtures/. test/integration/consumers/esm/test/fixtures/
cd test/integration/consumers/cjs
npm install --no-save --package-lock=false ../../../../simple-nunjucks-loader-3.2.0.tgz
npm run build
npm test
cd ../esm
npm install --no-save --package-lock=false ../../../../simple-nunjucks-loader-3.2.0.tgz
npm run build
npm test
```

Use the filename printed by `npm pack` if the package version changes. Packing
runs the existing `prepack` build. Each consumer installs the tarball directly,
without modifying its manifest or creating a lockfile.
Webpack reads each consumer’s local `test/fixtures`; assertions and expectations
are shared in place. Test scripts explicitly select the assertion suites so Node
does not discover copied fixture JavaScript as tests. Each consumer keeps its generated bundles under
`dist/`, compiled tests under `tests/`, and its dependencies under `node_modules/`; generated fixture copies are also ignored by Git.

CI uploads the tarball once, then runs explicit copy, install, build, and test steps for each
consumer in four jobs:
Windows/Ubuntu × Node 22/24. Jest now runs source unit tests only; integration assertions use Node’s test runner.
