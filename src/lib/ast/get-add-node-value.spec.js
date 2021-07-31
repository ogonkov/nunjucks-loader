import nunjucks from 'nunjucks';

import {getAddNodeValue} from './get-add-node-value';


it('should join add tag', function() {
    const nodes = nunjucks.parser.parse(
        '{{ "a" + "b" + "c" + "d" }}'
    );
    const addNode = nodes.children[0].children[0];

    expect(getAddNodeValue(addNode).toString()).toBe(
        '"a" + "b" + "c" + "d"'
    );
});

it('should join add node with variables', function() {
    const nodes = nunjucks.parser.parse(
        '{{ "a" + b + "c" + d }}'
    );
    const addNode = nodes.children[0].children[0];

    expect(getAddNodeValue(addNode).toString()).toBe(
        '"a" + b + "c" + d'
    );
});
