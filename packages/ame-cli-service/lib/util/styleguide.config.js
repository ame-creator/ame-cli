const path = require('path')

module.exports = {
  logger: {
    warn: console.warn,
    info: console.log,
    debug: console.log
  },
  require: [
    path.join(__dirname, '../config/global.requires.js'),
    path.join(__dirname, '../config/global.styles.styl')
  ],
  renderRootJsx: path.join(__dirname, '../config/styleguide.root.js')
}
