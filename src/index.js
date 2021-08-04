import prettyBytes from 'pretty-bytes'
import dateTime from 'date-time'
import assets from './assets.js'

const RE_MEDIA = /^(?:audio|image|video)\/*/

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
  return `.file-icon_type_${icon}{background-image:url("${assets.icons[icon]}")}`
}

function getCSS(files) {
  const iconStyle = [...new Set(files.map((file) => getIconName(file)))]
    .map((icon) => iconToCSS(icon))
    .join('')
  return `<style>${assets.css}${iconStyle}</style>`
}

export default {
  imports: {
    getIconName,
    getCSS,
    prettyBytes,
    dateTime,
  },
  process: [
    {
      accept: 'text/html',
      render: assets.template,
    },
  ],
}
