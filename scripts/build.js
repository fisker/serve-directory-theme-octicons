const CHARSET = 'utf-8'

const fs = require('fs')
const nodeSass = require('node-sass')
const octicons = require('octicons')
const babel = require('babel-core')
const prettier = require('prettier')
const babelConfig = JSON.parse(fs.readFileSync('../.babelrc', CHARSET))

const btoa = global.btoa || require('btoa')

const baseStyle = nodeSass
  .renderSync({
    file: '../src/style.scss',
    outputStyle: 'compressed'
  })
  .css.toString()
  .trim()

const icons = [
  'file-directory',
  'file-media',
  'file-pdf',
  'file-zip',
  'markdown',
  'file-symlink-file',
  'file'
  ]

const template = fs
  .readFileSync('../src/directory.ejs', 'utf-8')
  .replace(/>\s*</g, '><')

const asserts = {
  css: baseStyle,
  template: template,
  icons: {}
}

function getIcon(name) {
  const svg = octicons[name].toSVG({
    fill: '#6a737d',
    class: '',
    xmlns: 'http://www.w3.org/2000/svg'
  }).replace(' class=""', '')
  const img = 'data:image/svg+xml;base64,' + btoa(svg)
  // ie can't recognize
  // const img = 'url(data:image/svg+xml;utf8,' + encodeURIComponent(svg)
  return img
}

icons.forEach(function(icon) {
  asserts.icons[icon] = getIcon(icon)
})

fs.writeFileSync('../dist/asserts.json', JSON.stringify(asserts, null, 2))
fs.writeFileSync('../dist/index.js', (function() {
  let code = fs.readFileSync('../src/index.js', CHARSET)
  code = babel.transform(code, babelConfig).code
  code = prettier.format(
    code,
    prettier.resolveConfig.sync('prettier.config.js')
  )
  return code
})())