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

it.each(['null', 'none'])('should reject %s literals in add nodes', function(literal) {
    const nodes = nunjucks.parser.parse(`{{ "a" + ${literal} }}`);
    const addNode = nodes.children[0].children[0];

    expect(addNode.right.value).toBeNull();
    expect(() => getAddNodeValue(addNode)).toThrow(TypeError);
    expect(() => getAddNodeValue(addNode)).toThrow(
        'Unsupported node signature'
    );
});
