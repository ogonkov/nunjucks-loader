import {expect, it} from '@jest/globals';
import nunjucks from 'nunjucks';

import {getAddNodeValue} from './get-add-node-value';


it('should join add tag', function() {
    const nodes = nunjucks.parser.parse(
        '{{ "a" + "b" + "c" + "d" }}'
    );
    const output = nodes.children[0];
    if (output.typename !== 'Output') throw new Error('Expected an output node');
    const addNode = output.children[0];
    if (addNode.typename !== 'Add') throw new Error('Expected an add node');

    expect(getAddNodeValue(addNode).toString()).toBe(
        '"a" + "b" + "c" + "d"'
    );
});

it('should join add node with variables', function() {
    const nodes = nunjucks.parser.parse(
        '{{ "a" + b + "c" + d }}'
    );
    const output = nodes.children[0];
    if (output.typename !== 'Output') throw new Error('Expected an output node');
    const addNode = output.children[0];
    if (addNode.typename !== 'Add') throw new Error('Expected an add node');

    expect(getAddNodeValue(addNode).toString()).toBe(
        '"a" + b + "c" + d'
    );
});

it.each(['null', 'none'])('should reject %s literals in add nodes', function(literal) {
    const nodes = nunjucks.parser.parse(`{{ "a" + ${literal} }}`);
    const output = nodes.children[0];
    if (output.typename !== 'Output') throw new Error('Expected an output node');
    const addNode = output.children[0];
    if (addNode.typename !== 'Add') throw new Error('Expected an add node');

    if (addNode.right?.typename !== 'Literal') throw new Error('Expected a literal node');
    expect(addNode.right.value).toBeNull();
    expect(() => getAddNodeValue(addNode)).toThrow(TypeError);
    expect(() => getAddNodeValue(addNode)).toThrow(
        'Unsupported node signature'
    );
});
