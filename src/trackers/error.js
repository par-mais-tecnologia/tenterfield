const api = require('../helpers/api')
const StackTrace = require('stacktrace-js')
window.StackTrace = StackTrace
const { registerTracker } = require('../helpers/trackerRegister')

const captureOnError = function captureOnError (message, url, lineNo, columnNo, error) {
  captureError(error)
  return true
}

const captureUnhandledRejection = function captureUnhandledRejection (event) {
  event.promise.catch(captureError)
}

const captureError = function captureError (error) {
  const erroType = error.stack && error.stack.indexOf('Error: ') > -1 && error.stack.split(':')[0] || 'Error'
  return StackTrace.fromError(error)
    .then((stackFrames) => {
      api.logEvent({
        evt: 'ERROR',
        type: erroType,
        message: error.message,
        stackFrames,
        uri: location.href,
      })
    }).catch((error) => {
      console.error(error.toString())
    })
}

const errorTracker = () => {
  const errorHandlers = [window.onerror]

  window.onerror = function handleErrors () {
    errorHandlers.filter(f => f).forEach((handler) => {
      handler.apply(this, arguments)
    })
  }

  Object.defineProperty(window, 'onerror', {
    set: function (fn) { errorHandlers.push(fn) }
  })

  window.onerror = captureOnError

  window.addEventListener('unhandledrejection', captureUnhandledRejection)
}

const init = registerTracker('error', errorTracker)

module.exports = { init }