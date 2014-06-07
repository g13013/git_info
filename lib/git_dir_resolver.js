var fs = require('fs');
module.exports = function (gitDir) {
  gitDir = gitDir || '.git';

  if (!fs.existsSync(gitDir)) {
    return false;
  }

  if (fs.statSync(gitDir).isFile()) {
    //if .git is a file we need to read path from it
    gitDir = fs.readFileSync(gitDir, 'UTF-8').replace('gitdir: ', '');
  }

  return gitDir;
};
