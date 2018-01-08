var prettyBytes = require('pretty-bytes')
var uniq = require('lodash.uniq')
var asserts = require('./asserts.json')

function getIconName(file) {
  if (file.isDirectory()) {
    return 'file-directory'
  }

  if (/^(?:image|video|audio)\/*/.test(file.type)) {
    return 'file-media'
  }

  if (file.ext === '.pdf') {
    return 'file-pdf'
  }

  if (file.ext === '.zip') {
    return 'file-zip'
  }

  if (file.ext === '.markdown' || file.ext === '.md') {
    return 'markdown'
  }

  if (file.ext === '.lnk') {
    return 'file-symlink-file'
  }

  return 'file'
}

function getCSS(files) {
  return (
    '<style>' +
    asserts.css +
    uniq(files.map(getIconName))
      .map(function(icon) {
        return asserts.icons[icon]
      })
      .join('') +
    '</style>'
  )
}

module.exports = {
  imports: {
    DIRECTORY_STYLE: 'file-directory',
    getIconName: getIconName,
    getCSS: getCSS,
    prettyBytes: prettyBytes
  },
  process: [
    {
      accept: 'text/html',
      render: asserts.template
    }
  ]
}
