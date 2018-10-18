'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

var _prettyBytes = _interopRequireDefault(require('pretty-bytes'))

var _lodash = _interopRequireDefault(require('lodash.uniq'))

var _asserts = _interopRequireDefault(require('./asserts.json'))

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
  return '.file-icon_type_'
    .concat(icon, '{background-image:url(')
    .concat(_asserts.default.icons[icon], ')}')
}

function getCSS(files) {
  var style = ''
  style += _asserts.default.css
  style += (0, _lodash.default)(files.map(getIconName))
    .map(iconToCSS)
    .join('')
  return '<style>'.concat(style, '</style>')
}

var _default = {
  imports: {
    getIconName: getIconName,
    getCSS: getCSS,
    prettyBytes: _prettyBytes.default
  },
  process: [
    {
      accept: 'text/html',
      render: _asserts.default.template
    }
  ]
}
exports.default = _default
module.exports = exports['default']
