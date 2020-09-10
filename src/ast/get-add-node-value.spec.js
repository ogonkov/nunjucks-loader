import nunjucks from 'nunjucks';

import {getAddNodeValue} from './get-add-node-value';


it('should join add tag', function() {
    const nodes = nunjucks.parser.parse(
        '{{ "a" + "b" + "c" + "d" }}'
    );
    const addNode = nodes.children[0].children[0];

    expect(getAddNodeValue(addNode)).toBe(
        '"a" + "b" + "c" + "d"'
    );
});
