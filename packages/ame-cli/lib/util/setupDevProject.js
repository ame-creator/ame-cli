// dev only

// const path = require('path')
// const { linkBin } = require('@vue/cli/lib/util/linkBin')
const execa = require('execa')

module.exports = function setupDevProject (targetDir) {
  // return linkBin(
  //   require.resolve('ame-cli-service/bin/ame-cli-service'),
  //   path.join(targetDir, 'node_modules', '.bin', 'ame-cli-service')
  // )

  return execa('npm', ['link', 'ame-cli-service'], {
    cwd: targetDir
  })
}
