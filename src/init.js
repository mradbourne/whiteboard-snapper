const RaspiCam = require('raspicam')
const Slack = require('slack-node')
const RpiLeds = require('rpi-leds')
const config = require('../config')
const capture = require('./capture')

const initAlexa = require('./alexa')
const initCli = require('./cli')

const init = () => {
  const camera = new RaspiCam({
    mode: 'photo',
    output: 'captures/capture.jpg',
    width: 1620,
    height: 1232,
    quality: 80
  })
  camera.on('read', (err, timestamp, filename) => {
    capture.success({slack, leds}, {timestamp})
  })
  const slack = new Slack(config.slackApiToken)
  const leds = new RpiLeds()

  initAlexa({camera, slack, leds})
  initCli({camera, slack, leds})
}

init()
