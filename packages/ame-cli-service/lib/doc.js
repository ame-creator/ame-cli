const styleguidist = require('vue-styleguidist')
const Service = require('@vue/cli-service')

const config = require('./util/styleguide.config.js')

function serve (args) {
  const context = process.cwd()

  config.components = `${context}/src/*.vue`

  const styleguide = styleguidist(config, conf => {
    conf.webpackConfig = getWebpackConfig(context, 'development')
  })

  const server = styleguide.binutils.server(args.open).app

  // in order to avoid ghosted threads at the end of tests
  ;['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      server.close(() => {
        process.exit(0)
      })
    })
  })

  // in tests, killing the process with SIGTERM causes execa to
  // throw
  if (process.env.VUE_CLI_TEST) {
    process.stdin.on('data', data => {
      if (data.toString() === 'close') {
        // eslint-disable-next-line no-console
        console.log('got close signal!')
        server.close(() => {
          process.exit(0)
        })
      }
    })
  }
}

function build () {
  const context = process.cwd()

  config.components = `${context}/src/*.vue`

  const styleguide = styleguidist(config, conf => {
    conf.webpackConfig = getWebpackConfig(context)
  })

  styleguide.binutils.build()
}

function getWebpackConfig (context, mode = 'production') {
  const service = new Service(context)
  service.init(mode)
  const webpackConf = service.resolveChainableWebpackConfig()
  webpackConf.plugins.delete('hmr')
  webpackConf.plugins.delete('friendly-errors')
  return service.resolveWebpackConfig(webpackConf)
}

module.exports = {
  serve,
  build
}
