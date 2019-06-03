const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const rollup = require('rollup')
const Service = require('@vue/cli-service')
const { toPlugin, findExisting } = require('./util/util')

const babelPlugin = toPlugin('@vue/cli-plugin-babel')
const eslintPlugin = toPlugin('@vue/cli-plugin-eslint')
const typescriptPlugin = toPlugin('@vue/cli-plugin-typescript')

const globalConfigPlugin = require('./util/globalConfigPlugin')
const getRollupConfig = require('./util/rollupConfig')

function resolveEntry (context) {
  const entry = findExisting(context, [
    'src/index.js',
    'src/index.ts'
  ])

  if (!entry) {
    console.log(chalk.red(`Failed to locate entry file in ${chalk.yellow(context)}.`))
    console.log(chalk.red(`Valid entry file should be one of: src/index.js, src/index.ts.`))

    console.log()
    process.exit(1)
  }

  if (!fs.existsSync(path.join(context, entry))) {
    console.log(chalk.red(`Entry file ${chalk.yellow(entry)} does not exist.`))

    console.log()
    process.exit(1)
  }

  return entry
}

async function rollupBuild () {
  const context = process.cwd()

  const rollupConfig = getRollupConfig(context)

  await Promise.all(rollupConfig.map(async config => {
    const bundle = await rollup.rollup(config)

    await bundle.write(config.output)

    console.log(`build success: ${config.output.file}`)
  }))

  console.log('build success.')
}

function createService (context, entry, asLib) {
  return new Service(context, {
    projectOptions: {
      compiler: true,
      lintOnSave: true
    },
    plugins: [
      babelPlugin,
      eslintPlugin,
      typescriptPlugin,
      globalConfigPlugin(context, entry, asLib)
    ]
  })
}

module.exports = async function build (args) {
  const context = process.cwd()
  const asLib = true
  const entry = resolveEntry(context)

  await createService(context, entry, asLib).run('build', {
    ...args,
    entry,
    target: 'lib'
  })

  await rollupBuild()
}
