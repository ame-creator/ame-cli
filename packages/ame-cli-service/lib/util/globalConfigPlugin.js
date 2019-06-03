const path = require('path')
const resolve = require('resolve')
const { findExisting } = require('./util')

module.exports = function createConfigPlugin (context, entry, asLib) {
  return {
    id: '@vue/cli-service-global-config',
    apply: (api, options) => {
      api.chainWebpack(config => {
        // entry is *.vue file, create alias for built-in js entry
        if (/\.vue$/.test(entry)) {
          config.resolve
            .alias
              .set('~entry', path.resolve(context, entry))
          entry = require.resolve('../../template/main.js')
        } else {
          // make sure entry is relative
          if (!/^\.\//.test(entry)) {
            entry = `./${entry}`
          }
        }

        // ensure core-js polyfills can be imported
        config.resolve
          .alias
            .set('core-js', path.dirname(require.resolve('core-js')))
            .set('regenerator-runtime', path.dirname(require.resolve('regenerator-runtime')))

        // ensure loaders can be resolved properly
        // this is done by locating vue's install location (which is a
        // dependency of the global service)
        const modulePath = path.resolve(require.resolve('vue'), '../../../')
        config.resolveLoader
          .modules
            .add(modulePath)

        // add resolve alias for vue and vue-hot-reload-api
        // but prioritize versions installed locally.
        try {
          resolve.sync('vue', { basedir: context })
        } catch (e) {
          const vuePath = path.dirname(require.resolve('vue'))
          config.resolve.alias
            .set('vue$', `${vuePath}/${options.compiler ? `vue.esm.js` : `vue.runtime.esm.js`}`)
        }

        try {
          resolve.sync('vue-hot-reload-api', { basedir: context })
        } catch (e) {
          config.resolve.alias
            .set('vue-hot-reload-api', require.resolve('vue-hot-reload-api'))
        }

        // set entry
        config
          .entry('app')
            .clear()
            .add(entry)

        if (!asLib) {
          // set html plugin template
          const indexFile = findExisting(context, [
            'index.html',
            'public/index.html'
          ]) || path.resolve(__dirname, '../../template/index.html')
          config
            .plugin('html')
              .tap(args => {
                args[0].template = indexFile
                return args
              })
        }

        // disable copy plugin if no public dir
        if (asLib || !findExisting(context, ['public'])) {
          config.plugins.delete('copy')
        }
      })
    }
  }
}
