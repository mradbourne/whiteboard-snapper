var fs = require('fs');
var term = require( 'terminal-kit' ).terminal;
var Slack = require('slack-node');
var config = require('./config');

slack = new Slack(config.slackApiToken);

term.grabInput();

term.on( 'key' , function( name , matches , data ) {
  if ( name === 'ENTER' ) {
    slack.api('files.upload', {
      file: fs.createReadStream('./capture.jpg'),
      filename: config.whiteboardName,
      title: config.whiteboardName + ' contents',
      initial_comment: config.whiteboardName + ' has just been cleared',
      channels: '#general'
    }, function(err, response){
      console.log(response);
    });
  } else if ( name === 'CTRL_C' ) {
    term.grabInput( false ) ;
    setTimeout( function() { process.exit() } , 100 ) ;
  }
});

term.colorRgb(250,77,25).bold( 'Welcome to TAB whiteboard nanny\n' ) ;
term.defaultColor( 'Hit CTRL-C to quit.\n\n' ) ;
