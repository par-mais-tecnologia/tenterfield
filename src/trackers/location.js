const api = require('../helpers/api')
const {registerTracker} = require('../helpers/trackerRegister')

const debounce = function (func, wait, immediate) {
  let timeout
  return function () {
    const context = this, args = arguments
    let later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

const timeTracker = () => {
  const {location, history} = window
  const realPushState = history.pushState
  history.pushState = function (state, title, URL) {
    debounce(api.logEvent({
      evt: `URI`,
      uri: URL.indexOf('http') === 0 ? URL : `${location.protocol}//${location.host}${URL}`,
    }), 100)
    return realPushState.apply(history, arguments)
  }
}

const init = registerTracker('location', timeTracker)

module.exports = {init}