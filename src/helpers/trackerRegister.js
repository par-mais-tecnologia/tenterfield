const activeTrackers = []
const registerTracker = (trackerName, trackerInit) => (conf) => {
  if(activeTrackers.indexOf(trackerName) > -1) {
    throw new Error('Tracker can only register once!')
  }
  trackerInit({...conf})
  activeTrackers.push(trackerName)
}

module.exports = {registerTracker}