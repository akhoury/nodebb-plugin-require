var path = require('path');
var fs = require('fs');

var isPackageDirectory = function (name, dir) {
	var pkg;
	try {
		pkg = JSON.parse(fs.readFileSync(path.join(dir, './package.json'), 'utf8'));
		return pkg.name == name;
	} catch (e) {
		return false;
	}
};

var findPackageDirectory = function (name, dir) {
	while (dir) {
		if (isPackageDirectory(name, dir)) {
			return dir;
		}
		var parts = dir.split(path.sep);
		parts.pop();
		dir = parts.join(path.sep);
	}
	throw new Error("Cannot find " + name 
			+ " installation path, are you sure you installed this module somewhere under /path/to/" + name 
			+ "/node_modules or at least it's symlinked in there? if you're using __dirname, try `process.env.PWD` instead, works with symlinks");
};


var isNodebbDirectory = function (dir) {
	return isPackageDirectory("nodebb", dir);
}

var findNodebbDirectory = function (startDir) {
	return findPackageDirectory("nodebb", startDir);
};

var fullpath = findNodebbDirectory(process.env.PWD);

var nodebbRequire = function (relative) {
	return require(path.join(fullpath, relative));
};

nodebbRequire.fullpath = fullpath;
nodebbRequire.isPackageDirectory = isNodebbDirectory;
nodebbRequire.findPackageDirectory = isNodebbDirectory;

// helpers?
nodebbRequire.isNodebbDirectory = isNodebbDirectory;
nodebbRequire.findNodebbDirectory = findNodebbDirectory;

module.exports = nodebbRequire;
