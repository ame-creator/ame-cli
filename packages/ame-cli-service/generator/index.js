const camelCase = require('camelcase')
const decamelize = require('decamelize')
const { renameFiles } = require('./fileHelper')

module.exports = (api, options, rootOptions) => {
  console.log('generator, options:', options, 'rootOptions:', rootOptions)

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
      'vue-template-compiler': '^2.6.10',
      sass: '^1.18.0',
      'sass-loader': '^7.1.0'
    }
  })

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
