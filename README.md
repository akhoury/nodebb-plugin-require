# nodebb-plugin-require
Easily require NodeBB/src modules from within any plugin when running that as a stand-alone script

## Usage

```
// from within other plugins

var nodebbRequire = require('nodebb-plugin-require');\

// to require the /path/to/NodeBB/src/user
var File = nodebbRequire('/src/file');

// you can also print out the full filepath
console.log(nodebbRequire.fullpath);

```

## other functions
You can these 2 for ther other packages as well, not just `nodebb`

### `nodebbRequire.isPackageDirectory(name, dir)`

```

nodebbRequire.isPackageDirectory('lodash', '/path/to/somewhere'); // true/false

```

### `nodebbRequire.findPackageDirectory(name, startDir)`

```
nodebbRequire.findPackageDirectory('lodash', 'path/to/somwhere/dark/and/scary');

```

## nodebb helper functions

### `nodebbRequire.isNodebbDirectory(dir)`
### `nodebbRequire.findNodebbDirectory(startDir)`
