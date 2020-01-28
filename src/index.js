const api = require('./helpers/api')
const click = require('./trackers/click')
const location = require('./trackers/location')
const time = require('./trackers/time')
const error = require('./trackers/error')

const availableTrackers = {
  click,
  location,
  time,
  error
}

function Tenterfield() {
  this.event = api.logEvent
  this.setup = function(conf = {}) {
    api.setup(conf.api)
  
    conf = {
      ...Object.keys(availableTrackers)
        .reduce((agg, curr) => ({
          [curr]: typeof conf[curr] === 'boolean' ||
          (typeof conf[curr] === 'object' && Object.keys(conf[curr]).length > 0) ?
            conf[curr] : true, ...agg
        }), {})
    }
    return Object.keys(conf)
      .map(toggle => conf[toggle] ? availableTrackers[toggle].init({...conf[toggle]}) : false)
      .filter(tracker => !!tracker)
  }
}

window.tenterfield = window.tenterfield || new Tenterfield()

module.exports = new Tenterfield()
