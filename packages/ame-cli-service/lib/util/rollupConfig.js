
const path = require('path')
const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const postcss = require('rollup-plugin-postcss')
const { terser } = require('rollup-plugin-terser')
const json = require('rollup-plugin-json')
const copy = require('rollup-plugin-copy-assets')

module.exports = function getRollupConfig (context) {
  return [
    {
      input: path.join(context, 'src/index.js'),
      output: {
        file: path.join(context, 'lib/index.js'),
        format: 'cjs'
      },
      external: ['vue'],
      plugins: [
        vue({
          css: false
        }),
        postcss({
          extract: path.join(context, 'lib/style/index.css'),
          minimize: true,
          extensions: ['.css', '.scss']
        }),
        nodeResolve(),
        commonjs(),
        json(),
        babel(),
        terser()
      ]
    },
    {
      input: path.join(context, 'src/index.js'),
      output: {
        file: path.join(context, 'es/index.js'),
        format: 'es'
      },
      external: ['vue'],
      plugins: [
        vue({
          css: false
        }),
        postcss({
          extract: path.join(context, 'es/style/index.css'),
          minimize: true,
          extensions: ['.css', '.scss']
        }),
        nodeResolve(),
        commonjs(),
        json(),
        babel(),
        terser()
      ]
    },
    {
      input: path.join(context, 'src/data.js'),
      output: {
        file: path.join(context, 'lib/data.js'),
        format: 'cjs'
      },
      plugins: [
        babel({
          babelrc: false,
          runtimeHelpers: true
        }),
        copy({
          assets: [
            './src/dataSchema.json'
          ]
        })
      ]
    }
  ]
}
