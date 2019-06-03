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
      'vue-class-component': '^7.0.2',
      'vue-property-decorator': '^8.1.0',
      'vuetify': '^1.5.0'
    },
    devDependencies: {
      '@vue/cli-plugin-typescript': '^3.8.0',
      '@vue/eslint-config-standard': '^4.0.0',
      '@vue/eslint-config-typescript': '^4.0.0',
      'eslint': '^5.16.0',
      'eslint-plugin-vue': '^5.0.0',
      'stylus': '^0.54.5',
      'stylus-loader': '^3.0.2',
      'typescript': '^3.4.3',
      'vue-template-compiler': '^2.6.10'
    }
  })

  if (!options.cssPreprocessor) {
    options.cssPreprocessor = 'sass'
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
