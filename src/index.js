import prettyBytes from 'pretty-bytes'
import uniq from 'lodash.uniq'
import asserts from './asserts.json'

const RE_MEDIA = /^(?:image|video|audio)\/*/

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
  return `.file-icon_type_${icon}{background-image:url("${
    asserts.icons[icon]
  }")}`
}

function getCSS(files) {
  let style = ''
  style += asserts.css
  style += uniq(files.map(getIconName))
    .map(iconToCSS)
    .join('')

  return `<style>${style}</style>`
}

export default {
  imports: {
    getIconName,
    getCSS,
    prettyBytes,
  },
  process: [
    {
      accept: 'text/html',
      render: asserts.template,
    },
  ],
}
