var path = require('path')
var fs = require('fs')
var octicons = require('octicons')
var nodeSass = require('node-sass')
var filesize = require('filesize')

var btoa =
  global.btoa ||
  function(str) {
    return new Buffer(str).toString('base64')
  }

var baseStyle = nodeSass
  .renderSync({
    file: path.join(__dirname, 'style.scss'),
    outputStyle: 'compressed'
  })
  .css.toString()

var supportIcons = {
  directory: 'file-directory',
  media: 'file-media',
  file: 'file'
}

function unique(array) {
  return Array.from(new Set(array))
}

function getIconName(file) {
  if (file.isDirectory()) {
    return 'file-directory'
  }

  if (/^(?:image|video|audio)\/*/.test(file.type)) {
    return 'file-media'
  }

  return 'file'
}

var iconCSS = {}
function getIcon(name) {
  if (iconCSS[name]) {
    return iconCSS[name]
  }
  var icon = octicons[name]
  icon.options.fill = '#6a737d'
  var svg = icon.toSVG()
  var img = 'data:image/svg+xml;base64,' + btoa(svg)
  // ie can't recognize
  // var img = 'url(data:image/svg+xml;utf8,' + encodeURIComponent(svg)
  var css = '.file__icon_' + iconName + '{background-image:url(' + img + ')}'
  return (iconCSS[name] = css)
}

function getCSS(files) {
  return (
    '<style>' +
    baseStyle +
    unique(files.map(getIconName)).map(getIcon) +
    '</style>'
  )
}

var template = fs
  .readFileSync(path.join(__dirname, 'directory.html'), 'utf-8')
  .replace(/>\s*</g, '><')

module.exports = {
  imports: {
    DIRECTORY_STYLE: 'file-directory',
    getIconName: getIconName,
    getCSS: getCSS,
    filesize: filesize
  },
  process: [
    {
      accept: 'text/html',
      render: template
    }
  ]
}
