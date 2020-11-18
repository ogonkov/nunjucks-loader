export default class TemplateLoader {
    getSource(name) {
        return {
            src: {
                type: 'code',
                obj: {
                    root(a, b, c, d, callback) {
                        callback(null, '<p>Template from custom loader</p>');
                    }
                }
            },
            path: name
        };
    }
}
