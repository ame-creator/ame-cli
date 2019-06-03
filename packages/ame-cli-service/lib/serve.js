const Service = require('@vue/cli-service')
const { toPlugin } = require('./util/util')

const babelPlugin = toPlugin('@vue/cli-plugin-babel')
const eslintPlugin = toPlugin('@vue/cli-plugin-eslint')
const typescriptPlugin = toPlugin('@vue/cli-plugin-typescript')
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
      typescriptPlugin,
      globalConfigPlugin(context, entry, asLib)
    ]
  })
}

module.exports = function serve (args) {
  const context = process.cwd()

  createService(context, 'example/index.vue').run('serve', args)
}
