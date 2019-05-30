const camelCase = require('camelcase')
const decamelize = require('decamelize')
const { renameFiles } = require('./fileHelper')

module.exports = (api, options, rootOptions) => {
  api.extendPackage({
    scripts: {
      'serve': 'ame-cli-service serve',
      'build': 'ame-cli-service build',
      'doc:serve': 'ame-cli-service doc:serve',
      'doc:build': 'ame-cli-service doc:build'
    },
    dependencies: {
      'vue': '^2.6.10',
      'xm-vue-ui': '^1.2.0'
    },
    devDependencies: {
      'vue-template-compiler': '^2.6.10'
    }
  })

  if (!options.cssPreprocessor) {
    options.cssPreprocessor = 'stylus'
  }

  if (options.cssPreprocessor) {
    const deps = {
      sass: {
        sass: '^1.18.0',
        'sass-loader': '^7.1.0'
      },
      less: {
        'less': '^3.0.4',
        'less-loader': '^4.1.0'
      },
      stylus: {
        'stylus': '^0.54.5',
        'stylus-loader': '^3.0.2'
      }
    }

    api.extendPackage({
      devDependencies: deps[options.cssPreprocessor]
    })
  }

  const { projectName } = options

  const additionalOptions = {
    componentName: camelCase(projectName, { pascalCase: true }),
    componentNameLowercase: decamelize(projectName, '-')
  }

  api.render('./template', additionalOptions)

  api.postProcessFiles(files => {
    renameFiles(files, /\/ComponentName\./, `/${additionalOptions.componentName}.`)
  })
}
