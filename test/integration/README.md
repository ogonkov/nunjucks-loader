# Package integration

Pack once, then test that tarball in CommonJS and ESM consumer
projects. Each project's native Webpack config builds `single.njk` with both
values of the loader's `esModule` option. One shared `assertions/single.test.ts`
uses static imports to load the bundles and compares rendered HTML with
`expected/single.html` (the existing single-file Jest snapshot's rendered value).

Each consumer's build runs Webpack followed by `tsc`. Its `tsconfig.json` extends
shared settings and selects CommonJS or ES2022 modules. Tests are emitted to
`tests/single.test.js`, where the consumer's package type determines how Node loads
them. CommonJS uses emitted `require()` calls; ESM preserves `import` statements.
Webpack exports the template function directly in both loader modes. The package
import mapping `#dist/*` points at generated bundles under `dist/`; a single
`assertions/dist.d.ts` declaration describes their template function exports.

Run locally from the repository root:

```sh
npm pack
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
Webpack reads the existing `test/fixtures` directly; assertions and
expectations are shared in place. Each consumer keeps its generated bundles under
`dist/`, compiled tests under `tests/`, and its dependencies under `node_modules/` (both ignored by Git).

CI uploads the tarball once, then runs explicit install, build, and test steps for each
consumer in four jobs:
Windows/Ubuntu × Node 22/24. The existing Jest suites remain unchanged.
