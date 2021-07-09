const path = require('path');
const homeDir = require('os').homedir();
const root = path.join(homeDir, '.cfbot');
const templatePath = path.join(root, 'template');
const cookiepath = path.join(root, 'cookies.json');

module.exports = { homeDir, root, templatePath, cookiepath };
