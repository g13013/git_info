'use strict';
var mockFn = require('./mock_func');
var rewire = require('rewire');

module.exports = {
  setUp: function (callback) {
    var testedModule = rewire('../');

    this.tree = {};
    this.writtenFiles = [];
    this.readFiles = [];
    this.createdDirectories = [];
    this.readStats = [];

    this.getModule = function (inject) {
      if (inject !== false) {
        this.injectAll();
      }
      return testedModule;
    };


    this.injectAll = function () {/*jshint camelcase:false*/
      testedModule.__set__({
        fs: {
          readFileSync: mockFn.readFileSync.bind(this),
          writeFileSync: mockFn.writeFileSync.bind(this),
          existsSync: mockFn.existsSync.bind(this)
        },
        mkdirp: {
          sync: mockFn.mkdirpSync.bind(this)
        }
      });
      return this;
    };

    this.inject = function (obj) {/*jshint camelcase:false*/
      testedModule.__set__(obj);
      return this;
    };

    this.getVar = function (varName) {/*jshint camelcase:false*/
      return testedModule.__get__(varName);
    };

    callback();
  }
};
