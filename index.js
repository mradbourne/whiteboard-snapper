const RaspiCam = require('raspicam')
const Slack = require('slack-node')
const RpiLeds = require('rpi-leds')
const config = require('./config')
const startCli = require('./cli')

const camera = new RaspiCam({
  mode: 'photo',
  output: './captures/capture.jpg',
  width: 1620,
  height: 1232,
  quality: 80
})
const slack = new Slack(config.slackApiToken)
const leds = new RpiLeds()

startCli({camera, slack, leds})
