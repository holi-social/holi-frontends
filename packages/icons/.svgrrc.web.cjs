const path = require('path')

module.exports = {
  native: false,
  icon: 24,
  prettier: false,
  indexTemplate: (filePaths) => {
    const exportEntries = filePaths.map((filePath) => {
      const basename = path.basename(filePath.path, '.web.js')
      const exportName = basename
      return `export { default as ${exportName} } from './${basename}.web'`
    })
    return exportEntries.join('\n')
  },
  replaceAttrValues: {
    '#262424': 'currentColor',
  },
}
