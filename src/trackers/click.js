const api = require('../helpers/api')
const {registerTracker} = require('../helpers/trackerRegister')

const getPath = (path) => {
  return path
    .filter(({tagName}) => tagName)
    .map(({id, classList, tagName}) => {
      const elmId = id ?
        '#' + id : classList.toString() ?
        '.' + classList.toString().split(' ').join('.') : ''
      return `${tagName.toLowerCase()}${elmId}`
    })
    .reverse()
    .join(' > ')
}

const clickEvent = ({path, target}) => {
  const trackable = path[0].childElementCount < 3
  if (trackable) {
    api.logEvent({
      evt: 'CLICK',
      uri: location.href,
      path: getPath(path),
      innerHTML: target.innerHTML,
    })
  }
}

const clickTracker = () => document.addEventListener('click', clickEvent)


const init = registerTracker('click', clickTracker)

module.exports = {init}