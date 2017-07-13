const $ = window.jQuery
const resolve = require('resolve-pathname')

const text = require('../helpers').text
const createLink = require('../helpers').createLink
const bloburl = require('../helpers').bloburl

module.exports.process = function () {
  $('.blob-code-inner').each((i, elem) => {
    let line = elem.innerText.trim()

    let using = line.match(/\busing +([\w ,]+)\b/)
    if (using) {
      using[1].split(',').map(n => n.trim()).forEach(moduleName => {
        (moduleName === 'Base' ? Base : juliaurl(moduleName))
        .then(info => createLink(elem, moduleName, info))
      })
    }

    let imp = line.match(/\bimport +(\w+)/)
    if (imp) {
      (imp[1] === 'Base' ? Base : juliaurl(imp[1]))
      .then(info => createLink(elem, imp[1], info, true))
    }

    let include = line.match(/\binclude *\(['"]([\w-_.]+.jl)['"]\)/)
    if (include) {
      let {user, repo, ref, current} = window.pathdata
      let path = resolve(include[1], current.join('/'))
      let url = bloburl(user, repo, ref, path)
      createLink(elem, include[1], url)
    }
  })
}

module.exports.juliaurl = juliaurl
function juliaurl (moduleName) {
  return text(`https://raw.githubusercontent.com/JuliaLang/METADATA.jl/metadata-v2/${moduleName}/url`)
    .then(url => ({
      url: url.trim().replace('git://', 'https://'),
      kind: 'external'
    }))
    .catch(() => '')
}

const Base = Promise.resolve({
  url: 'http://docs.julialang.org/en/stable/stdlib/base/',
  kind: 'stdlib'
})
