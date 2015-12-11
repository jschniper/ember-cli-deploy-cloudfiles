# ember-cli-deploy-cloudfiles

> An ember-cli-deploy plugin to upload files to Rackspace Cloud Files

[![](https://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/plugins/ember-cli-deploy-cloudfiles.svg)](http://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/)

This plugin uploads one or more files to a single [Rackspace Cloud Files](http://www.rackspace.com/cloud/files) container. It is most suited to upload the assets (js, css, images, fonts, etc.) into a container.


## What is an ember-cli-deploy plugin?

A plugin is an addon that can be executed as a part of the ember-cli-deploy pipeline. A plugin will implement one or more of the ember-cli-deploy's pipeline hooks.

For more information on what plugins are and how they worak, please refer to the [Plugin Documentation][1].

## Quick Start

To get up and running quickly, do the following:

- Ensure [ember-cli-deploy-build][2] is installed and configured.

- Install this plugin

```bash
$ ember install ember-cli-deploy-cloudfiles
```

- Place the following configuration into `config/deploy.js`

```javascript
ENV.cloudfiles = {
  region: '<your-rackspace-region>',
  username: '<your-rackspace-username>',
  apiKey: '<your-rackspace-api-key>',
  container: '<your-rackspace-container-name>'
}
```

- Run the pipeline

```bash
$ ember deploy
```

## Installation
Run the following command in your terminal:

```bash
ember install ember-cli-deploy-cloudfiles
```

## ember-cli-deploy Hooks Implemented

For detailed information on what plugin hooks are and how they work, please refer to the [Plugin Documentation][1].

- `upload`

## Configuration Options

For detailed information on how configuration of plugins works, please refer to the [Plugin Documentation][1].


### apiKey (`required`)

The Rackspace API key for the user that has the ability to upload to the `container`.

*Default:* `undefined`

### username (`required`)

The Rackspace username of the user that has the ability to upload to the `container`.

*Default:* `undefined`

### container (`required`)

The Rackspace Cloud Files container that the files will be uploaded to.

*Default:* `undefined`

### region (`required`)

The Rackspace region you are working on.

*Default:* `undefined`

### prefix

A directory within the `container` that the files should be uploaded in to.

*Default:* `''`

### filePattern

Files that match this pattern will be uploaded to the `container`. The file pattern must be relative to `distDir`.

*Default:* `\*\*/\*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2}`

### distDir

The root directory where the files matching `filePattern` will be searched for. By default, this option will use the `distDir` property of the deployment context, provided by [ember-cli-deploy-build][2].

*Default:* `context.distDir`

### distFiles

The list of built project files. This option should be relative to `distDir` and should include the files that match `filePattern`. By default, this option will use the `distFiles` property of the deployment context, provided by [ember-cli-deploy-build][2].

*Default:* `context.distFiles`

### manifestPath

The path to a manifest that specifies the list of files that are to be uploaded to Cloud Files.

This manifest file will be used to work out which files don't exist on Cloud Files and, therefore, which files should be uploaded. By default, this option will use the `manifestPath` property of the deployment context, provided by [ember-cli-deploy-manifest][4].

*Default:* `context.manifestPath`

### uploadClient

The client used to upload files to Cloud Files. This allows the user the ability to use their own client for uploading instead of the one provided by this plugin.

The client specified MUST implement a function called `upload`.

*Default:* the upload client provided by ember-cli-deploy-cloudfiles

### cloudFilesClient

The underlying library used to upload the files to Cloud Files. This allows the user to use the default upload client provided by this plugin but switch out the underlying library that is used to actually send the files.

The client specified MUST implement functions called `download` and `upload`.

*Default:* the default library is `pkgcloud`

## Prerequisites

The following properties are expected to be present on the deployment `context` object:

- `distDir`      (provided by [ember-cli-deploy-build][2])
- `distFiles`    (provided by [ember-cli-deploy-build][2])
- `manifestPath` (provided by [ember-cli-deploy-manifest][3])

## Running Tests

- `npm test`

[1]: http://ember-cli.github.io/ember-cli-deploy/plugins "Plugin Documentation"
[2]: https://github.com/ember-cli-deploy/ember-cli-deploy-build "ember-cli-deploy-build"
[3]: https://github.com/lukemelia/ember-cli-deploy-manifest "ember-cli-deploy-manifest"
