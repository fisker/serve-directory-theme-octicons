import fs from 'fs'
import path from 'path'
import sass from 'sass'
import writePrettierFile from 'write-prettier-file'
import SVGO from 'svgo'
import svgToMiniDataURI from 'mini-svg-data-uri'

import octicons from 'octicons'

const CHARSET = 'utf-8'
const iconMap = {
  directory: 'file-directory',
  media: 'file-media',
  pdf: 'file-pdf',
  zip: 'file-zip',
  markdown: 'markdown',
  symlink: 'file-symlink-file',
  file: 'file',
}

const svgo = new SVGO()

async function getIcon(icon) {
  const result = await svgo.optimize(icon.content)

  let uri = svgToMiniDataURI(result.data)
  uri = uri.replace('data:image/svg+xml,', 'data:image/svg+xml;charset=utf-8,')
  return {
    ...icon,
    uri,
  }
}

function getIcons() {
  const icons = Object.keys(iconMap).map((name) => {
    const octiconName = iconMap[name]
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

  return Promise.all(icons.map(getIcon))
}

;(async () => {
  const css = sass
    .renderSync({
      file: path.join(__dirname, '../src/style.scss'),
      outputStyle: 'compressed',
    })
    .css.toString()
    .trim()

  const template = fs
    .readFileSync(path.join(__dirname, '../src/directory.ejs'), CHARSET)
    .replace(/>\s*</g, '><')

  // eslint-disable-next-line node/no-unsupported-features/es-builtins
  const icons = Object.fromEntries(
    (await getIcons())
      .map(({name, uri}) => [name, uri])
      .sort(([name1], [name2]) => name1.localeCompare(name2))
  )

  await writePrettierFile(
    path.join(__dirname, '../.cache/assets.js'),
    `export default ${JSON.stringify({
      css,
      template,
      icons,
    })}`
  )
})()
