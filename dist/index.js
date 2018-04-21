'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

var _prettyBytes = require('pretty-bytes')

var _prettyBytes2 = _interopRequireDefault(_prettyBytes)

var _lodash = require('lodash.uniq')

var _lodash2 = _interopRequireDefault(_lodash)

var _asserts = require('./asserts.json')

var _asserts2 = _interopRequireDefault(_asserts)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj}
}

var RE_MEDIA = /^(?:image|video|audio)\/*/

function getIconName(file) {
  if (file.isDirectory()) {
    return 'directory'
  }

  if (RE_MEDIA.test(file.type)) {
    return 'media'
  }

  if (file.ext === '.pdf') {
    return 'pdf'
  }

  if (file.ext === '.zip') {
    return 'zip'
  }

  if (file.ext === '.markdown' || file.ext === '.md') {
    return 'markdown'
  }

  if (file.ext === '.lnk') {
    return 'symlink'
  }

  return 'file'
}

function iconToCSS(icon) {
  return (
    '.file-icon_type_' +
    icon +
    '{background-image:url(' +
    _asserts2.default.icons[icon] +
    ')}'
  )
}

function getCSS(files) {
  var style = ''
  style += _asserts2.default.css
  style += (0, _lodash2.default)(files.map(getIconName))
    .map(iconToCSS)
    .join('')

  return '<style>' + style + '</style>'
}

exports.default = {
  imports: {
    getIconName: getIconName,
    getCSS: getCSS,
    prettyBytes: _prettyBytes2.default
  },
  process: [
    {
      accept: 'text/html',
      render: _asserts2.default.template
    }
  ]
}
module.exports = exports['default']
