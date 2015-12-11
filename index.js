/* jshint node: true */
'use strict';

var Promise = require('ember-cli/lib/ext/promise');
var minimatch = require('minimatch');
var DeployPluginBase = require('ember-cli-deploy-plugin');
var CloudFiles = require('./lib/cloudfiles');

module.exports = {
  name: 'ember-cli-deploy-cloudfiles',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,

      defaultConfig: {
        enabled: true,
        filePattern: '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2}',
        prefix: '',

        distDir: function(context) {
          return context.distDir;
        },

        distFiles: function(context) {
          return context.distFiles || [];
        },

        manifestPath: function(context) {
          return context.manifestPath; // e.g. from ember-cli-deploy-manifest
        },

        uploadClient: function(context) {
          return context.uploadClient; // if you want to provide your own upload client to be used instead of one from this plugin
        },

        cloudFilesClient: function(context) {
          return context.cloudFilesClient; // if you want to provide your own Cloud Files client to be used instead of one from aws-sdk
        }
      },

      requiredConfig: ['region', 'username', 'apiKey', 'container'],

      upload: function(/* context */) {
        if (this.readConfig('enabled') === false) {
          this.log('plugin has been disabled with "enabled = false" option', { verbose: true });
          return;
        }

        var self = this;

        var filePattern   = this.readConfig('filePattern');
        var distDir       = this.readConfig('distDir');
        var distFiles     = this.readConfig('distFiles');
        var container     = this.readConfig('container');
        var prefix        = this.readConfig('prefix');
        var manifestPath  = this.readConfig('manifestPath');

        var filesToUpload = distFiles.filter(minimatch.filter(filePattern, { matchBase: true }));

        var cloudfiles = this.readConfig('uploadClient') || new CloudFiles({
          plugin: this
        });

        var options = {
          cwd: distDir,
          filePaths: filesToUpload,
          prefix: prefix,
          container: container,
          manifestPath: manifestPath
        };

        this.log('preparing to upload to CloudFiles container `' + container + '`', { verbose: true });

        return cloudfiles.upload(options).then(function(filesUploaded){
          self.log('uploaded ' + filesUploaded.length + ' files ok', { verbose: true });
          return { filesUploaded: filesUploaded };
        }).catch(this._errorMessage.bind(this));
      },

      _errorMessage: function(error) {
        this.log(error, { color: 'red' });

        if (error) {
          this.log(error.stack, { color: 'red' });
        }
        return Promise.reject(error);
      }
    });

    return new DeployPlugin();
  }
};
