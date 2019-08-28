const register = require('@gooddata/mock-js');

function registerMocks(app) {
    const schema = require('../mock-schema.js');
    const config = {
        randomSeed: 'reactcomponents',
        pollCount: 1
    };
    const options = { schema, config };
    options.absolutePathToRootMockFile = __dirname + '/../mock-schema.js';
    options.suffixOfMockFilesImportedInRootMockFile = 'mock.js';
    options.getSchema = mockObject => mockObject;
    return register.default(app, options);
}

module.exports = registerMocks;
