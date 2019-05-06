
	var nbbRequire = require('../index');
	var path = require('path');
	var url = require('url');
	var nconf = nbbRequire('nconf');

	var databaseName = nconf.get('database');
	if (!databaseName) {
		nconf.file({ file: path.join(nbbRequire.fullpath, '/config.json') });
		var pkg = require(path.join(nbbRequire.fullpath, '/package.json'));
		nconf.defaults({
			base_dir: nbbRequire.fullpath,
			themes_path: path.join(nbbRequire.fullpath, '/node_modules'),
			upload_path: 'public/uploads',
			views_dir: path.join(nbbRequire.fullpath, '/build/public/templates'),
			version: pkg.version
		});
	}
	var database = nbbRequire('src/database');

	if (!database.client) {
		// this means, NodeBB is not running since there is no instance of the db client
		// so we need to init that client and connect to the database using database.init()

		// we need to setup some configs in memory first, I copied that function straight from Nodebb core
		// straight from https://github.com/NodeBB/NodeBB/blob/v1.12.1/src/start.js#L13
		// todo: expose NodeBB/src/start.setupConfigs() and call it here instead
		setupConfigs();

		database.init(function (err) {
			if (err) {
				throw err
			}
			doStuff()
		});
	} else {
		// NodeBB is running
		doStuff()
	}

	function setupConfigs() {
		// nconf defaults, if not set in config
		if (!nconf.get('sessionKey')) {
			nconf.set('sessionKey', 'express.sid');
		}

		// Parse out the relative_url and other goodies from the configured URL
		var urlObject = url.parse(nconf.get('url'));
		var relativePath = urlObject.pathname !== '/' ? urlObject.pathname.replace(/\/+$/, '') : '';
		nconf.set('base_url', urlObject.protocol + '//' + urlObject.host);
		nconf.set('secure', urlObject.protocol === 'https:');
		nconf.set('use_port', !!urlObject.port);
		nconf.set('relative_path', relativePath);
		nconf.set('port', nconf.get('PORT') || nconf.get('port') || urlObject.port || (nconf.get('PORT_ENV_VAR') ? nconf.get(nconf.get('PORT_ENV_VAR')) : false) || 4567);
	}

	function doStuff () {
		console.log('done');
		process.exit(0);
	}
