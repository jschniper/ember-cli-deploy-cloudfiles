# ember-cli-deploy-cloudfiles

[![](https://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/plugins/ember-cli-deploy-cloudfiles.svg)](http://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/)

This is the cloudfiles-adapter implementation to use [cloudfiles](http://www.rackspace.com/cloud/files) with
[ember-deploy](https://github.com/levelbossmike/ember-deploy).

This is an unapologetic clone of the s3-adapter with just enough changed to get it working.

TODO:
- Better error handling
- Check for container and create it if it doesn't already exist

Sample Usage:

In the config/deploy.js add: 

    assets: {
       type: 'cloudfiles',
       region: 'ORD',
       username: 'rackspace-username',
       apiKey: process.env['RACKSPACE_API_KEY'],
       container: 'sample-container'
     }
