var CoreObject   = require('core-object');
var Promise      = require('ember-cli/lib/ext/promise');
var SilentError  = require('ember-cli/lib/errors/silent');
var chalk        = require('chalk');
var fs           = require('fs');
var dive         = require('dive');
var RSVP         = require('rsvp');

var white = chalk.white;
var green = chalk.green;

var EXPIRE_IN_2030 = new Date('2030');
var TWO_YEAR_CACHE_PERIOD_IN_SEC = 60 * 60 * 24 * 365 * 2;

module.exports = CoreObject.extend({
    init: function() {
        if (!this.config) {
            return Promise.reject(new SilentError('You have to pass a config!'));
        }

        this.pkgcloud = this.pkgcloud || require('pkgcloud');
        this.client = this.pkgcloud.storage.createClient({
            provider: 'rackspace',                 // required
            username: this.config.assets.username, // required
            apiKey: this.config.assets.apiKey,     // required
            region: this.config.assets.region,     // required
            useInternal: false 
        });
    },

    upload: function() {
        var client = this.client;
        var _this  = this;

        if (!this.ui) {
            var message = 'You have to pass a UI to an adapter.';
            return Promise.reject(new SilentError(message));
        }

        this.ui.pleasantProgress.start(green('Uploading assets'), green('.'));

        return new Promise(function(resolve, reject) {
            var promises = [];

            dive('tmp/assets-sync', function(err, file) {
                var promise = new Promise(function(resolve, reject) {
                    var name = file.split('assets-sync')[1];

                    var reader = fs.createReadStream(file);
                    var writer = client.upload({
                        container: _this.config.assets.container,
                        remote: name,
                        size: fs.statSync(file)['size']
                    });

                    writer.on('success', _this.logSuccess.bind(_this, resolve, file));
                    writer.on('error', _this.logError.bind(_this, reject, err));

                    reader.pipe(writer);
                });

                promises.push(promise);
            },
            function(err, dir) {
                if (err) throw err;

                RSVP.all(promises).then(function() {
                    _this.printEndMessage();
                    resolve();
                }).catch(function(msg) {
                    _this.ui.writeLine(msg)

                    reject();
                });
            });
        });

        return promise;
    },

    logSuccess: function(resolve, file) {
        this.ui.writeLine('Uploading: ' + green(file));
        resolve();
    },

    logError: function(reject, err) {
        var errorMessage = 'Unable to sync: ' + err;
        reject(new SilentError(errorMessage));
    },

    printEndMessage: function() {
        this.ui.writeLine('Assets upload successful. Done uploading.');
        this.ui.pleasantProgress.stop();
    }
});
