const CHARSET = 'utf-8'

const fs = require('fs')
const nodeSass = require('node-sass')
const octicons = require('octicons')
const babel = require('@babel/core')
const prettier = require('prettier')
const stringify = require('json-stable-stringify')

const babelConfig = JSON.parse(fs.readFileSync('../.babelrc', CHARSET))

const SVGO = require('svgo')
const svgToMiniDataURI = require('mini-svg-data-uri')

const svgo = new SVGO()

const baseStyle = nodeSass
  .renderSync({
    file: '../src/style.scss',
    outputStyle: 'compressed',
  })
  .css.toString()
  .trim()

const template = fs
  .readFileSync('../src/directory.ejs', 'utf-8')
  .replace(/>\s*</g, '><')

const asserts = {
  css: baseStyle,
  template,
  icons: {
    directory: 'file-directory',
    media: 'file-media',
    pdf: 'file-pdf',
    zip: 'file-zip',
    markdown: 'markdown',
    symlink: 'file-symlink-file',
    file: 'file',
  },
}

function getIcon(icon) {
  return svgo.optimize(icon.content).then(function(result) {
    let uri = svgToMiniDataURI(result.data)
    uri = uri.replace(
      'data:image/svg+xml,',
      'data:image/svg+xml;charset=utf-8,'
    )
    return {
      ...icon,
      uri,
    }
  })
}

function getIcons() {
  const icons = Object.keys(asserts.icons).map(name => {
    const octiconName = asserts.icons[name]
    const content = octicons[octiconName].toSVG({
      fill: '#6a737d',
      class: '',
      'aria-hidden': '',
      xmlns: 'http://www.w3.org/2000/svg',
    })

    return {
      name,
      content,
    }
  })

  return Promise.all(icons.map(getIcon)).then(icons => {
    icons.forEach(icon => {
      asserts.icons[icon.name] = icon.uri
    })
  })
}

getIcons().then(() => {
  fs.writeFileSync('../lib/asserts.json', stringify(asserts, {space: 2}))
  fs.writeFileSync(
    '../lib/index.js',
    (() => {
      let code = fs.readFileSync('../src/index.js', CHARSET)
      code = babel.transform(code, babelConfig).code
      code = prettier.format(
        code,
        prettier.resolveConfig.sync('../lib/index.js')
      )
      return code
    })()
  )
})
