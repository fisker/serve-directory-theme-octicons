var fs = require('fs')
var nodeSass = require('node-sass')
var octicons = require('octicons')

var btoa = global.btoa || require('btoa')

var baseStyle = nodeSass
  .renderSync({
    file: '../src/style.scss',
    outputStyle: 'compressed'
  })
  .css.toString()
  .trim()

var icons = [
  'file-directory',
  'file-media',
  'file-pdf',
  'file-zip',
  'markdown',
  'file-symlink-file',
  'file'
  ]

var template = fs
  .readFileSync('../src/directory.html', 'utf-8')
  .replace(/>\s*</g, '><')

var asserts = {
  css: baseStyle,
  template: template,
  icons: {}
}

function getIcon(name) {
  var icon = octicons[name]
  icon.options.fill = '#6a737d'
  icon.options.class = ''
  icon.options.xmlns = 'http://www.w3.org/2000/svg'
  var svg = icon.toSVG()
  var img = 'data:image/svg+xml;base64,' + btoa(svg)
  // ie can't recognize
  // var img = 'url(data:image/svg+xml;utf8,' + encodeURIComponent(svg)
  var css = '.file__icon_' + name + '{background-image:url(' + img + ')}'
  return css
}

icons.forEach(function(icon) {
  asserts.icons[icon] = getIcon(icon)
})

fs.writeFileSync('../dist/asserts.json', JSON.stringify(asserts))
fs.writeFileSync('../dist/index.js', fs.readFileSync('../src/index.js'))