var chai              = require('chai');
var chaiAsPromised    = require('chai-as-promised');
var MockUI            = require('ember-cli/tests/helpers/mock-ui');
var CloudfilesAdapter = require('../../../lib/cloudfiles');
var chalk             = require('chalk');

chai.use(chaiAsPromised);

var CloudfilesAdapter;
var expect = chai.expect;

var stubConfig = {
    "assets": {
        "username": "username",
        "apiKey": "api-key",
        "bucket": "bucket-name"
    }
}

describe('CloudfilesAdapter', function() {
    it('rejects if no config is passed on initialization', function() {
        cloudfilesAdapter = new CloudfilesAdapter({
            ui: new MockUI()
        });

        return expect(cloudfilesAdapter.init()).to.be.rejected;
    });

    it('rejects if the config is missing a required param', function() {
        cloudfilesAdapter = new CloudfilesAdapter({
            ui: new MockUI(),
            config: {
                "assets": {
                    "username": "there",
                    "apiKey": "also here",
                    //bucket: "missing"
                }
            }
        });

        return expect(cloudfilesAdapter.init()).to.be.rejected;
    });

    it('rejects if no ui is passed on initialization', function() {
        cloudfilesAdapter = new CloudfilesAdapter({
            config: stubConfig
        });

        return expect(cloudfilesAdapter.upload()).to.be.rejected;
    });

    it('fulfills otherwise', function() {
        cloudfilesAdapter = new CloudfilesAdapter({
            ui: new MockUI(),
            config: stubConfig
        });

        return expect(cloudfilesAdapter.upload()).to.be.fulfilled;
    });
});
