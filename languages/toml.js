const $ = window.jQuery
const startswith = require('lodash.startswith')

const createLink = require('../helpers').createLink
const cratesurl = require('./rust').cratesurl

module.exports.process = function process () {
  switch (location.pathname.split('/').slice(-1)[0]) {
    case 'Cargo.toml':
      cargotoml()
      break
  }
}

function cargotoml () {
  var depsOpen = false

  $('.blob-code-inner').each((_, elem) => {
    elem = $(elem)
    let line = elem.text().trim()

    if (/(\[|\.)(dev-)?dependencies\]/.test(line)) {
      depsOpen = true
      return
    }

    if (startswith(line, '[')) {
      depsOpen = false
      return
    }

    if (depsOpen) {
      let moduleName = elem.find('.pl-smi').eq(0).text().trim()
      cratesurl(moduleName)
        .then(url => {
          createLink(elem.get(0), moduleName, url)
        })
        .catch(() => {})
    }
  })
}
