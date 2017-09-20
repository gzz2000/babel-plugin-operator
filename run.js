var fs = require('fs');
var babel = require('babel-core');
var plugin = require('./index.js');

var fileName = process.argv[2];

fs.readFile(fileName, function(err, data) {
    if(err) throw err;
    var src = data.toString();
    var out = babel.transform(src, {
	presets: ["es2015", "stage-2"],
	plugins: [plugin]
    });
    console.log(out.code);
});
