/* jshint node: true */
'use strict';

var CloudfilesAdapter = require('./lib/cloudfiles');

module.exports = {
  name: 'ember-deploy-cloudfiles',

  type: 'ember-deploy-addon',

  adapters: {
    assets: {
      'cloudfiles': CloudfilesAdapter
    }
  }
}
