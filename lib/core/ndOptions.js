var fs = require('fs');
var path = './config.json';
var json = fs.readFileSync(path);
var configData = JSON.parse(json);
module.exports = configData;