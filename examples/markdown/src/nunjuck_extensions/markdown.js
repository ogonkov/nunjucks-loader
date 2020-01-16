const Markdown = require('nunjucks-markdown/lib/markdown_tag');
const marked = require('marked');

module.exports = new Markdown(null, marked);
