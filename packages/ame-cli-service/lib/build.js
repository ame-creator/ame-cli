
// const path = require('path')
// const fs = require('fs-extra')
// const rollup = require('rollup')
// const getRollupConfig = require('./util/rollupConfig')

// module.exports = async function build (args) {
//   const context = process.cwd()

//   const rollupConfig = getRollupConfig(context)

//   await fs.remove(path.join(context, 'lib'))
//   await fs.remove(path.join(context, 'es'))

//   await Promise.all(rollupConfig.map(async config => {
//     const bundle = await rollup.rollup(config)

//     await bundle.write(config.output)

//     console.log(`build success: ${config.output.file}`)
//   }))

//   console.log('build success.')
// }

const Service = require('@vue/cli-service')
const { toPlugin } = require('./util/util')

const babelPlugin = toPlugin('@vue/cli-plugin-babel')
const eslintPlugin = toPlugin('@vue/cli-plugin-eslint')
const globalConfigPlugin = require('./util/globalConfigPlugin')

function createService (context, entry, asLib) {
  return new Service(context, {
    projectOptions: {
      compiler: true,
      lintOnSave: true
    },
    plugins: [
      babelPlugin,
      eslintPlugin,
      globalConfigPlugin(context, entry, asLib)
    ]
  })
}

module.exports = function build (args) {
  const context = process.cwd()
  const asLib = true
  const entry = 'src/index.js'

  createService(context, entry, asLib).run('build', {
    ...args,
    entry,
    target: 'lib'
  })
}
