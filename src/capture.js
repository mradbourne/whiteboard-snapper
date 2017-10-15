const fs = require('fs')
const config = require('../config')

const sendToSlack = ({camera, slack, leds}) => {
  leds.status.turnOff()
  camera.start()
}

const success = ({slack, leds}, {timestamp}) => {
  slack.api('files.upload', {
    file: fs.createReadStream('./captures/capture.jpg'),
    filename: config.whiteboardName + '_' + timestamp + '.jpg',
    title: config.whiteboardName + ' ' + timestamp,
    initial_comment: config.whiteboardName + ' has just been cleared',
    channels: '#general'
  }, (err, response) => {
    console.log('Capture finished!')
    fs.unlinkSync('./captures/capture.jpg')
    leds.status.blink()
  })
}

module.exports = {
  sendToSlack,
  success
}
