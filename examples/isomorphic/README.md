# Using same templates on server and client

It's a simple example of using same templates on client and server.

It's not ideal, and just suggestion on how it could look.

## Be aware of `mini-css-extract-plugin` bug!

I found strange [bug in `mini-css-extract-plugin`](webpack-contrib/mini-css-extract-plugin#489),
that throws error, when CSS is imported in template, that is rendered via
`html-webpack-plugin`.

In this example i use a hack/workaround/temporary solution:

1. Split CSS rule to the one for imports from Nunjucks templates and one for
   imports from JS;
2. Create `styles.js`, to import every style i use in templates.

I believe that it's not how it should work, so looking forward to bug to fix.

## Run demo

```bash
git clone -b gh-pages git@github.com:ogonkov/nunjucks-loader.git
cd examples/isomorphic
npm install
npm run build
```
