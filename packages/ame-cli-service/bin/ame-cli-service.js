#!/usr/bin/env node

const chalk = require('chalk')
const semver = require('semver')
const { error } = require('@vue/cli-shared-utils')
const requiredVersion = require('../package.json').engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
  error(
    `You are using Node ${process.version}, but vue-cli-service ` +
      `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  )
  process.exit(1)
}

const program = require('commander')

program
  .command('serve')
  .description('serve demo in development mode')
  .option('-o, --open', 'Open browser')
  .action(cmd => {
    require('../lib/serve')(cleanArgs(cmd))
  })

program
  .command('doc:serve')
  .description('serve doc in development mode')
  .option('-o, --open', 'Open browser')
  .action(cmd => {
    require('../lib/doc').serve(cleanArgs(cmd))
  })

program
  .command('doc:build')
  .description('build doc')
  .action(cmd => {
    require('../lib/doc').build(cleanArgs(cmd))
  })

// output help information on unknown commands
program
  .arguments('<command>')
  .action(cmd => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
  })

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`vue <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
