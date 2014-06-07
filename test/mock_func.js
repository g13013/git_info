exports.writeFileSync = function writeFile(path, content) {
  this.writtenFiles.push({path: path, content: content});
};

exports.mkdirpSync = function mkdirpSync(path) {
  this.createdDirectories.push(path);
};

exports.existsSync = function existsSync(path) {
  return this.tree[path] || this.createdDirectories.indexOf(path) > -1 || this.writtenFiles.indexOf(path) > -1;
};

exports.readFileSync = function readFile(path) {
  if (path in this.tree) {
    this.readFiles.push(path);
    return this.tree[path].content || '';
  } else {
    throw new Error('Error: ENOENT, no such file or directory \'' + path + '\'');
  }
};
