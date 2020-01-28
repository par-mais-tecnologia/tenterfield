const Bundler = require('parcel-bundler')
const Path = require('path')
const Nightmare = require('nightmare')
const nightmare = Nightmare()
require('chai').should()

let server
const serverPort = 43233
const serverUrl = `http://localhost:${serverPort}`

const entryFiles = Path.join(__dirname, './index.html')
const options = {
  watch: false,
  global: 'tenterfield',
  port: serverPort
}

before(function () {
  this.timeout('5s')
  const bundler = new Bundler(entryFiles, options)
  return bundler.serve(serverPort)
    .then((_server) => server = _server)
    .then(() => nightmare.goto(serverUrl))
    .then(() => nightmare
      .evaluate(() => {
        // Nightmare "evaluate" runs on browser context
        window.events = []
        window.tenterfield.setup({
          api: {
            callback: (payload) => events.push(payload)
          }
        })
        configured = true
      }))
})

after(() => {
  server.close()
  nightmare.end()
})

describe('User Tracking test suite', () => {

  describe('Click Tracking', () => {

    it('should log click', () => nightmare
      .click('#inlineError')
      .wait(100)
      .then(() => nightmare.evaluate(() => events.find(({payload}) => {
        const {evt, innerHTML, path} = payload
        return evt === 'CLICK' &&
          innerHTML === 'Inline ERROR!' &&
          path === 'html > body > button#inlineError'
      }) !== undefined))
      .then((hasClickEvent) => hasClickEvent.should.be.true))

  })

  describe('Error Tracking', () => {

    it('should log inlineError', () => nightmare
      .click('#inlineError')
      .wait(100)
      .then(() => nightmare.evaluate(() => events.find(({payload}) => {
        const {evt, message} = payload
        return evt === 'ERROR' &&
          message === 'inlineErrorCall is not defined'
      }) !== undefined))
      .then((hasErrorEvent) => hasErrorEvent.should.be.true))

    it('should log scriptError', () => nightmare
      .click('#scriptError')
      .wait(100)
      .then(() => nightmare.evaluate(() => events.find(({payload}) => {
        const {evt, message} = payload
        return evt === 'ERROR' &&
          message === 'scriptError is not a function'
      }) !== undefined))
      .then((hasErrorEvent) => hasErrorEvent.should.be.true))

    it('should log networkError', function () {
      this.timeout('10s')
      return nightmare
        .click('#networkError')
        .wait(100)
        .then(() => nightmare.evaluate(() => events.find(({payload}) => {
          const {evt, message} = payload
          return evt === 'ERROR' &&
            message === 'Failed to fetch'
        }) !== undefined))
        .then((hasErrorEvent) => hasErrorEvent.should.be.true)
    })

    it('should log unhandledRejection', () => nightmare
      .click('#unhandledRejection')
      .wait(100)
      .then(() => nightmare.evaluate(() => events.find(({payload}) => {
        const {evt, message} = payload
        return evt === 'ERROR' &&
          message === 'unhandledRejection is not a function'
      }) !== undefined))
      .then((hasErrorEvent) => hasErrorEvent.should.be.true))

    it('should log unhandledError', () => nightmare
      .click('#unhandledError')
      .wait(100)
      .then(() => nightmare.evaluate(() => events.find(({payload}) => {
        const {evt, message} = payload
        return evt === 'ERROR' &&
          message === 'unhandled'
      }) !== undefined))
      .then((hasErrorEvent) => hasErrorEvent.should.be.true))

    it('should log location change', () => nightmare
      .evaluate(() => history.pushState('', '', '/path'))
      .then(() => nightmare.evaluate(() => events.find(({payload}) => {
        const {evt, uri} = payload
        return evt === 'URI' &&
          uri.indexOf('/path') > -1
      }) !== undefined))
      .then((hasErrorEvent) => hasErrorEvent.should.be.true))

  })

  describe('Testing session time tracking. Waiting ~10s', () => {

    it('should log session time', function () {
      this.timeout('12s')
      return nightmare
        .wait(10500)
        .then(() => nightmare.evaluate(() => events.find(({payload}) => {
          const {evt, resolution} = payload
          return evt === 'SESSION' &&
            resolution === 10
        }) !== undefined))
        .then((hasErrorEvent) => hasErrorEvent.should.be.true)
    })

  })

  describe('Custom event', () => {
    it('should log a custom event', () => nightmare
      .click('#customEvent')
      .wait(100)
      .then(() => nightmare.evaluate(() => events.find(({payload}) => {
          const {evt, type} = payload
          return evt === 'CUSTOM' && type === 'custom-event'
        }) !== undefined))
      .then((hasCustomEvent) => hasCustomEvent.should.be.true)
    )
  })
})
