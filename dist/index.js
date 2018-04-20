'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
var prettyBytes = require('pretty-bytes')
var uniq = require('lodash.uniq')
var asserts = require('./asserts.json')
var RE_MEDIA = /^(?:image|video|audio)\/*/

function getIconName(file) {
  if (file.isDirectory()) {
    return 'file-directory'
  }

  if (RE_MEDIA.test(file.type)) {
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

function iconToCSS(icon) {
  return (
    '.file-icon_' + icon + '{background-image:url(' + asserts.icons[icon] + ')}'
  )
}

function getCSS(files) {
  var style = ''
  style += asserts.css
  style += uniq(files.map(getIconName))
    .map(iconToCSS)
    .join('')

  return '<style>' + style + '</style>'
}

exports.default = {
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
module.exports = exports['default']
