
var filesize = require('filesize')
var asserts = require('asserts.json')

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

function getIconName(file) {
  if (file.isDirectory()) {
    return 'file-directory'
  }

  if (/^(?:image|video|audio)\/*/.test(file.type)) {
    return 'file-media'
  }

  return 'file'
}

function getCSS(files) {
  return
  '<style>' +
    asserts.css +
    unique(files.map(getIconName))
      .map(function(icon) {
        return asserts.icons[icon]
      })
      .join('') +
    '</style>'
}

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
      render: asserts.template
    }
  ]
}
