const fs = require('fs')
const config = require('./config')

const postToSlack = ({camera, slack, leds}) => {
  leds.status.turnOff()
  camera.start()
  camera.on('read', (err, timestamp, filename) => {
    if (filename === 'capture.jpg') {
      slack.api('files.upload', {
        file: fs.createReadStream('./captures/capture.jpg'),
        filename: config.whiteboardName + '_' + timestamp + '.jpg',
        title: config.whiteboardName + ' ' + timestamp,
        initial_comment: config.whiteboardName + ' has just been cleared',
        channels: '#general'
      }, (err, response) => {
        leds.status.blink()
      })
    }
  })
}

module.exports = postToSlack
