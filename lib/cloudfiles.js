/* jshint node: true */
var CoreObject = require('core-object');
var fs         = require('fs');
var path       = require('path');
var mime       = require('mime');

var Promise    = require('ember-cli/lib/ext/promise');

var _          = require('lodash');
var EXPIRE_IN_2030               = new Date('2030');
var TWO_YEAR_CACHE_PERIOD_IN_SEC = 60 * 60 * 24 * 365 * 2;

module.exports = CoreObject.extend({
  init: function(options) {
    this._plugin = options.plugin;
    var pkgcloud = require('pkgcloud');
    this._client = this._plugin.readConfig('cloudFilesClient') || pkgcloud.storage.createClient({
      provider: 'rackspace',
      region: this._plugin.readConfig('region'),
      username: this._plugin.readConfig('username'),
      apiKey: this._plugin.readConfig('apiKey'),
      useInternal: false
    });
  },

  upload: function(options) {
    options = options || {};
    return this._determineFilePaths(options).then(function(filePaths){
      return Promise.all(this._putObjects(filePaths, options));
    }.bind(this));
  },

  _determineFilePaths: function(options) {
    var plugin = this._plugin;
    var filePaths = options.filePaths || [];
    if (typeof filePaths === 'string') {
      filePaths = [filePaths];
    }
    var prefix       = options.prefix;
    var manifestPath = options.manifestPath;
    if (manifestPath) {
      var key = prefix === '' ? manifestPath : [prefix, manifestPath].join('/');
      plugin.log('Downloading manifest for differential deploy from `' + key + '`...', { verbose: true });
      return new Promise(function(resolve, reject){
        var params = { container: options.container, remote: key };
        this._client.download(params, function(error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result.toString().split('\n'));
          }
        }.bind(this));
      }.bind(this)).then(function(manifestEntries){
        plugin.log("Manifest found. Differential deploy will be applied.", { verbose: true });
        return _.difference(filePaths, manifestEntries);
      }).catch(function(/* reason */){
        plugin.log("Manifest not found. Disabling differential deploy.", { color: 'yellow', verbose: true });
        return Promise.resolve(filePaths);
      });
    } else {
      return Promise.resolve(filePaths);
    }
  },

  _putObjects: function(filePaths, options) {
    var plugin           = this._plugin;
    var cwd              = options.cwd;
    var prefix           = options.prefix;
    var container        = options.container;
    // var cacheControl     = 'max-age='+TWO_YEAR_CACHE_PERIOD_IN_SEC+', public';
    // var expires          = EXPIRE_IN_2030;

    var manifestPath = options.manifestPath;
    var pathsToUpload = filePaths;
    if (manifestPath) {
      pathsToUpload.push(manifestPath);
    }

    return pathsToUpload.map(function(filePath) {
      var basePath    = path.join(cwd, filePath);
      var contentType = mime.lookup(basePath);
      var encoding    = mime.charsets.lookup(contentType);
      var size        = fs.statSync(basePath)['size'];
      var key         = prefix === '' ? filePath : [prefix, filePath].join('/');
      var reader      = fs.createReadStream(basePath);

      if (encoding) {
        contentType += '; charset=';
        contentType += encoding.toLowerCase();
      }

      var params = {
        container: container,
        remote: key,
        size: size
        // contentType: contentType,
        // cacheControl: cacheControl,
        // expires: expires
      };

      return new Promise(function(resolve, reject) {
        var writer = this._client.upload(params);

        writer.on('success', function () {
          plugin.log('✔  ' + key, { verbose: true });
          resolve(filePath);
        });

        writer.on('error', function (error) {
          reject(error);
        });

        reader.pipe(writer);
      }.bind(this));
    }.bind(this));
  }
});
