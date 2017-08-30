const shell = require('shelljs');
const path = require('path');

const dist = path.resolve(__dirname, './dist');

shell.rm('-rf', dist);
