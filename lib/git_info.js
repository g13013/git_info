/*
 * git_info
 * https://github.com/g13013/git_info
 *
 * Copyright (c) 2014 Aboubakr GASMI
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var resolveGitDir = require('./git_dir_resolver');
var info = {
  branch: '',
  rev: '',
  shortRev: ''
};

module.exports = function readInfo(dir) {
  dir = resolveGitDir(dir);

  if (dir === false){
    return info;
  }

  var re, ref, head;
  var sha = '';
  var branch = 'HEAD'; //default if detached

  if (!fs.existsSync(dir +'/HEAD')) {
    return info;
  }

  ref = fs.readFileSync(dir +'/HEAD', 'UTF-8');
  head = /(ref\: )?(.+)\s$/.exec(ref);
  if (head) {
    //if it's a branch, we read the rev from it's ref file
    if (head[1]) {
      ref = head[2];
      branch = ref.replace('refs/heads/', '');
      if (fs.existsSync(dir + '/' + ref)) {
        //read sha from file under refs folder if exists
        sha = fs.readFileSync(dir +'/' + ref, 'UTF-8');
      } else if (fs.existsSync(dir + '/' + 'packed-refs')) {
        //otherwise read it from "packed-refs" file
        re = new RegExp('^([^\\s]{40})\\s' + ref + '$', 'm');
        sha = re.exec(fs.readFileSync(dir + '/' + 'packed-refs'));
        sha = sha && sha[1] || '';
      }
    } else {
      // otherwise we return the rev found in the HEAD file
      sha = head[2];
    }
  }

  info.branch = branch;
  info.rev = sha.trim();
  info.shortRev = sha.substr(0, 7);

  return info;
};
