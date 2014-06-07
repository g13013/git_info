'use strict';
var testObject = require('./mock_setup');

function resolveGitDir() {
  return '.git';
}

testObject.branch = function (test) {
  this.inject({
    resolveGitDir: resolveGitDir
  });
  this.tree['.git/HEAD'] = {content: 'ref: refs/heads/branch1\n'};
  this.tree['.git/refs/heads/branch1'] = {content: 'BBBBBBB4b861ead3ce71da670b266ca43c19c42c'};
  this.tree['.git/packed-refs'] = {content: [
      '# pack-refs with: peeled fully-peeled ',
      'AAAAAAA4b861ead3ce71da670b266ca43c19c42c refs/heads/branch1',
      '4f7dbbd102e691901d0a17d436c25063bbec6ac4 refs/remotes/github/branch1',
      ''
    ].join('\n')};

  var module = this.getModule();
  var info = module();

  test.deepEqual(info, {
    branch: 'branch1',
    rev: 'BBBBBBB4b861ead3ce71da670b266ca43c19c42c',
    shortRev: 'BBBBBBB'
  });

  delete this.tree['.git/refs/heads/branch1'];
  info = module();

  test.deepEqual(info, {
    branch: 'branch1',
    rev: 'AAAAAAA4b861ead3ce71da670b266ca43c19c42c',
    shortRev: 'AAAAAAA'
  });


  test.done();
};

testObject.detached = function (test) {
  this.inject({
    resolveGitDir: resolveGitDir
  });
  this.tree['.git/HEAD'] = {content: 'BBBBBBB4b861ead3ce71da670b266ca43c19c42c\n'};
  this.tree['.git/packed-refs'] = {content: [
      '# pack-refs with: peeled fully-peeled ',
      'BBBBBBB4b861ead3ce71da670b266ca43c19c42c refs/heads/branch1',
      ''
    ].join('\n')};

  var module = this.getModule();
  var info = module();

  test.deepEqual(info, {
    branch: 'HEAD',
    rev: 'BBBBBBB4b861ead3ce71da670b266ca43c19c42c',
    shortRev: 'BBBBBBB'
  });

  test.done();
};

module.exports = testObject;
