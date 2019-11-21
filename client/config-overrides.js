/* config-overrides.js */
// const { injectBabelPlugin } = require('react-app-rewired')
const { override, addBabelPlugin, useEslintRc, disableEsLint } = require('customize-cra')

// module.exports = function override (config, env) {
//   // do stuff with the webpack config...
//   const c = addBabelPlugin('transform-react-pug')
//   return config
// }
module.exports = override(
  disableEsLint(),
  // useEslintRc(),
  addBabelPlugin('transform-react-pug')
)
