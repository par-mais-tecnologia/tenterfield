let defaultConf = {
  headers: []
}

const setup = (conf) => {
  defaultConf = {...defaultConf, ...conf}
}

module.exports = {
  setup,
  logEvent: (payload) => {
    const {endpoint, additionalPayload, callback} = defaultConf
    if (callback) {
      callback({payload})
    }

    if (endpoint) {
      const additionalPayloadObject = additionalPayload
        .reduce((acc, curr) => ({
          ...acc,
          [curr.name]: typeof curr.value === 'function' ? curr.value() : curr.value
        }), {})

      const options = {
        method: 'POST',
        headers: {'content-type': 'text/plain'},
        mode: 'cors',
        body: JSON.stringify({...payload, ...additionalPayloadObject}),
        cache: 'default'
      }

      fetch(endpoint, options)
        .catch(() => {})
    }
  }
}
