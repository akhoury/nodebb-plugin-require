var path = require('path');
var fs = require('fs');

var isPackageDirectory = function (name, dir) {
	var pkg;
	try {
		pkg = JSON.parse(fs.readFileSync(path.join(dir, './package.json'), 'utf8'));
		return pkg.name === name;
	} catch (e) {
		return false;
	}
};

var findPackageDirectory = function (name, dir) {
	var odir = dir;
	while (dir) {
		if (isPackageDirectory(name, dir)) {
			return dir;
		}
		var parts = dir.split(path.sep);
		parts.pop();
		dir = parts.join(path.sep);
	}


	var oparts = odir.split(path.sep);
	oparts.pop();
	var pdir = oparts.join(path.sep);

	// no luck? try sibling directories
	var siblings = getSiblingDirectories(pdir).concat(getSiblingDirectories(odir));
	var pkgdir;
	siblings.some(function (dir) {
		if (isPackageDirectory(name, dir)) {
			pkgdir = dir;
			return true;
		}
		return false;
	});
	if (pkgdir) {
		return pkgdir;
	}

	throw new Error("Cannot find " + name
			+ " installation path, are you sure you installed this module somewhere under /path/to/" + name
			+ "/node_modules or at least it's symlinked in there? if you're using __dirname, try `process.env.PWD` instead, works with symlinks");
};

var isDirectory = function (source) {
    return fs.lstatSync(source).isDirectory();
};

var getSiblingDirectories = function (source) {
    var list = fs.readdirSync(source);
    return list.map(function (name) {
    	return path.join(source, name);
    }).filter(isDirectory);
};

var isNodebbDirectory = function (dir) {
	return isPackageDirectory("nodebb", dir);
};

var findNodebbDirectory = function (startDir) {
	return findPackageDirectory("nodebb", startDir);
};

var fullpath = findNodebbDirectory(process.env.PWD);
// this would work too, but costs 1 more iteration
// var fullpath = findNodebbDirectory(require.main.filename);

var nodebbRequire = function (relative) {
	var m;
	try {
		m = require(path.join(fullpath, relative));
	} catch (e1) {
		try {
            m = require(path.join(fullpath, 'node_modules', relative))
		} catch (e2) {
			throw new Error('2 Errors:\n' + '\t* ' + e1.message + '\n\t* ' + e2.message);
		}
	}
	return m;
};

nodebbRequire.fullpath = fullpath;
nodebbRequire.isPackageDirectory = isNodebbDirectory;
nodebbRequire.findPackageDirectory = isNodebbDirectory;

// helpers?
nodebbRequire.isNodebbDirectory = isNodebbDirectory;
nodebbRequire.findNodebbDirectory = findNodebbDirectory;

module.exports = nodebbRequire;
