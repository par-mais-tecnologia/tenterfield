const api = require('../helpers/api')
const {registerTracker} = require('../helpers/trackerRegister')

const minimumResolution = 10

const session = {
  time: 0,
  get isActive() {
    return document.hasFocus()
  },
  get totalTime() {
    return ++this.time
  }
}

const timeTracker = ({resolution = minimumResolution}) => {
  setInterval(() => {
    if(session.isActive && session.totalTime % resolution === 0) {
      api.logEvent({
        evt: `SESSION`,
        resolution,
        uri: location.href
      })
    }
  }, 1000)
}

const init = registerTracker('time', timeTracker)

module.exports = {init}