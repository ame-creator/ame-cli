/* eslint-disable */
// make sure generators are using the latest version of plugins,
// and plugins are using the latest version of deps

const fs = require('fs')
const path = require('path')
const globby = require('globby')
const inquirer = require('inquirer')

const writeCache = {}
const bufferWrite = (file, content) => {
  writeCache[file] = content
}
const flushWrite = () => {
  for (const file in writeCache) {
    fs.writeFileSync(file, writeCache[file])
  }
}

async function syncDeps({ version, skipPrompt }) {
  const packages = await globby(['packages/ame-*/package.json'])

  const resolvedPackages = packages
    .filter(filePath => filePath.match(/cli|cli-service/))
    .map(filePath => {
      const pkg = require(path.resolve(__dirname, '../', filePath))
      if (!pkg.dependencies) {
        return
      }
      const resolvedDeps = []
      return {
        pkg,
        filePath,
        resolvedDeps
      }
    })

  for (const { pkg, filePath } of resolvedPackages) {
    pkg.version = version
    bufferWrite(filePath, JSON.stringify(pkg, null, 2) + '\n')
  }

  if (!Object.keys(writeCache).length) {
    return console.log(`All packages up-to-date.`)
  }

  if (skipPrompt) {
    flushWrite()
    return
  }

  const { yes } = await inquirer.prompt([
    {
      name: 'yes',
      type: 'confirm',
      message: 'Commit above updates?'
    }
  ])

  if (yes) {
    flushWrite()
  }
}

exports.syncDeps = syncDeps

if (!process.env.VUE_CLI_RELEASE) {
  const args = require('minimist')(process.argv.slice(2))
  syncDeps(args).catch(err => {
    console.log(err)
    process.exit(1)
  })
}
