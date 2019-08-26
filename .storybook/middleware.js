const register = require('@gooddata/mock-js');

function registerMocks(app) {
    const schema = require('../mock-schema.js');
    const config = {
        randomSeed: 'reactcomponents',
        pollCount: 1
    };
    console.log(__dirname);
    schema.absolutePathToRootMockFile = __dirname + '../mock-schema.js';
    schema.suffixOfMockFilesImportedInRootMockFile = 'mock.js';
    return register.default(app, { schema, config });
}

module.exports = registerMocks;
