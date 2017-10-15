const term = require('terminal-kit').terminal
const capture = require('./capture')
// const config = require('../config')

const init = ({camera, slack, leds}) => {
  leds.status.blink()
  term.grabInput()

  term.on('key', (name, matches, data) => {
    if (name === 'ENTER') {
      // const slackChannel = config.slackDefaultChannel
      capture.sendToSlack({camera, slack, leds})
    } else if (name === 'CTRL_C') {
      term.grabInput(false)
      leds.status.reset()
      setTimeout(() => process.exit(), 100)
    }
  })

  term.colorRgb(64, 244, 208).bold(`
__________
          '--..
        \\     ',
      (-)        ',
        ________,'
      _/\\/\\/\\/\\/       Snapping turtle says
    /             Whiteboard Snapper is running!
    \\/\\/\\/\\/\\
____________,'

`)

  term.defaultColor('Hit ENTER to capture.\nHit CTRL-C to quit.\n\n')
}

module.exports = init
