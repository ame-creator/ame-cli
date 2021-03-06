const chalk = require('chalk')
const inquirer = require('inquirer')
const EventEmitter = require('events')
const cloneDeep = require('lodash.clonedeep')
const Generator = require('@vue/cli/lib/Generator')
const sortObject = require('@vue/cli/lib/util/sortObject')
const writeFileTree = require('@vue/cli/lib/util/writeFileTree')
const { installDeps } = require('@vue/cli/lib/util/installDeps')
const {
  log,
  loadModule,
  stopSpinner,
  hasYarn,
  hasPnpm3OrLater
} = require('@vue/cli-shared-utils')

module.exports = class Creator extends EventEmitter {
  constructor (name, context) {
    super()

    this.name = name
    this.context = process.env.VUE_CLI_CONTEXT = context
    this.createCompleteCbs = []
  }

  async create (cliOptions = {}, preset = null) {
    const isTestOrDebug = process.env.VUE_CLI_TEST || process.env.VUE_CLI_DEBUG
    const { name, context, createCompleteCbs } = this
    if (!preset) {
      preset = {
        plugins: {}
      }
    }

    preset = cloneDeep(preset)
    const version = require('../package.json').version
    // inject core service
    preset.plugins['ame-cli-service'] = Object.assign(
      {
        projectName: name,
        version: `^${version}`
      },
      preset
    )

    const packageManager = (
      cliOptions.packageManager ||
      (hasYarn() ? 'yarn' : null) ||
      (hasPnpm3OrLater() ? 'pnpm' : 'npm')
    )

    const pkg = {
      name,
      version: '0.1.0',
      private: true,
      devDependencies: {}
    }
    const deps = Object.keys(preset.plugins)
    deps.forEach(dep => {
      if (preset.plugins[dep]._isPreset) {
        return
      }

      pkg.devDependencies[dep] = preset.plugins[dep].version || 'latest'
    })

    // write package.json
    await writeFileTree(context, {
      'package.json': JSON.stringify(pkg, null, 2)
    })

    // install plugins
    stopSpinner()
    log(`⚙  Installing CLI plugins. This might take a while...`)
    log()
    this.emit('creation', { event: 'plugins-install' })
    if (isTestOrDebug) {
      // in development, avoid installation process
      await require('./util/setupDevProject')(context)
    } else {
      await installDeps(context, packageManager, cliOptions.registry)
    }

    const plugins = await this.resolvePlugins(preset.plugins)

    const generator = new Generator(context, {
      pkg,
      plugins,
      completeCbs: createCompleteCbs
    })
    await generator.generate({
      extractConfigFiles: preset.useConfigFiles
    })
  }

  // { id: options } => [{ id, apply, options }]
  async resolvePlugins (rawPlugins) {
    // ensure cli-service is invoked first
    rawPlugins = sortObject(rawPlugins, ['ame-cli-service'], true)
    const plugins = []
    for (const id of Object.keys(rawPlugins)) {
      const apply = loadModule(`${id}/generator`, this.context) || (() => {})
      let options = rawPlugins[id] || {}
      if (options.prompts) {
        const prompts = loadModule(`${id}/prompts`, this.context)
        if (prompts) {
          log()
          log(`${chalk.cyan(options._isPreset ? `Preset options:` : id)}`)
          options = await inquirer.prompt(prompts)
        }
      }
      plugins.push({ id, apply, options })
    }
    return plugins
  }
}
