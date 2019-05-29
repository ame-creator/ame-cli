
const path = require('path')
const fs = require('fs-extra')
const rollup = require('rollup')
const getRollupConfig = require('./util/rollupConfig')

module.exports = async function build (args) {
  const context = process.cwd()

  const rollupConfig = getRollupConfig(context)

  await fs.remove(path.join(context, 'lib'))
  await fs.remove(path.join(context, 'es'))

  await Promise.all(rollupConfig.map(async config => {
    const bundle = await rollup.rollup(config)

    await bundle.write(config.output)

    console.log(`build success: ${config.output.file}`)
  }))

  console.log('build success.')
}
