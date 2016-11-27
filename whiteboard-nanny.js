var fs = require('fs');
var term = require( 'terminal-kit' ).terminal;
var Slack = require('slack-node');
var config = require('./config');
var RaspiCam = require("raspicam");

var camera = new RaspiCam({
	mode: 'photo',
	output: './capture.jpg',
	width: 1620,
	height: 1232,
	quality: 80
});

slack = new Slack(config.slackApiToken);

term.grabInput();

term.on( 'key' , function( name , matches , data ) {
  if ( name === 'ENTER' ) {
	  camera.start();
	  camera.on('read', function(err, timestamp, filename) {
		  if (filename === 'capture.jpg') {
		slack.api('files.upload', {
			file: fs.createReadStream('./capture.jpg'),
			filename: config.whiteboardName + '_' + timestamp + '.jpg',
			title: config.whiteboardName + ' ' + timestamp,
			initial_comment: config.whiteboardName + ' has just been cleared',
			channels: '#general'
		}, function(err, response){
			console.log(response);
		});
		}
	});
  } else if ( name === 'CTRL_C' ) {
    term.grabInput( false ) ;
    setTimeout( function() { process.exit() } , 100 ) ;
  }
});

term.colorRgb(250,77,25).bold( 'Welcome to TAB whiteboard nanny\n' ) ;
term.defaultColor( 'Hit CTRL-C to quit.\n\n' ) ;
