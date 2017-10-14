const express = require('express')
const alexa = require('alexa-app')

const init = () => {
  const port = process.env.port || 8080
  const urlPath = 'snapperApi'
  const app = express()

  const alexaApp = new alexa.app(urlPath)

  alexaApp.express({
    expressApp: app,

    // verifies requests come from amazon alexa. Must be enabled for production.
    // You can disable this if you're running a dev environment and want to POST
    // things to test behavior. enabled by default.
    checkCert: false,

    // sets up a GET route when set to true. This is handy for testing in
    // development, but not recommended for production. disabled by default
    debug: false
  })

  // now POST calls to /${urlPath} in express will be handled by the app.request() function
  // from here on you can setup any other express routes or middlewares as normal

  alexaApp.intent('RepeatIntent', {
    'slots': {
      'VALUE': 'AMAZON.NUMBER'
    },
    'utterances': [
      'repeat {-|VALUE}'
    ]
  }, (req, res) => {
    const value = req.slot('VALUE')
    res.say(`You said ${value}.`)
  })

  // Log skill info for Amazon Developer Console
  console.log(`\nSCHEMA\n------\n${alexaApp.schema()}`)
  console.log(`\nUTTERANCES\n----------\n${alexaApp.utterances()}`)

  app.listen(port)
  console.log(`Alexa skill listening on port ${port}. Try http://localhost:${port}/${urlPath}`)
}

module.exports = init
