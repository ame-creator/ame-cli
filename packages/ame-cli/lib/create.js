const path = require('path')
const Creator = require('./Creator')
const { error, stopSpinner } = require('@vue/cli-shared-utils')

async function create (projectName, options) {
  const cwd = options.cwd || process.cwd()
  const targetDir = path.resolve(cwd, projectName || '.')

  const creator = new Creator(projectName, targetDir)
  await creator.create(options)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    if (!process.env.VUE_CLI_TEST) {
      process.exit(1)
    }
  })
}
