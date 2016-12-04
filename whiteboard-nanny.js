var fs = require('fs');
var term = require('terminal-kit').terminal;
var Slack = require('slack-node');
var config = require('./config');
var RaspiCam = require("raspicam");
var RpiLeds = require('rpi-leds');
var leds = new RpiLeds();
var fliclib = require("./lib/fliclibNodeJs");
var FlicClient = fliclib.FlicClient;
var FlicConnectionChannel = fliclib.FlicConnectionChannel;
var FlicScanner = fliclib.FlicScanner;

var flic = new FlicClient("localhost", 5551);

var camera = new RaspiCam({
  mode: 'photo',
  output: './capture.jpg',
  width: 1620,
  height: 1232,
  quality: 80
});

slack = new Slack(config.slackApiToken);





flic.once("ready", function() {
	console.log("Connected to daemon!");
	flic.getInfo(function(info) {
		info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
			listenToButton(bdAddr);
		});
	});
});

leds.status.blink();

term.grabInput();

term.on( 'key' , function( name , matches , data ) {
  if ( name === 'ENTER' ) {
		postToSlack();
  } else if ( name === 'CTRL_C' ) {
    term.grabInput( false ) ;
    leds.status.reset();
    setTimeout(function() { process.exit() }, 100);
  }
});

term.colorRgb(250,77,25).bold( 'Welcome to TAB whiteboard nanny\n' ) ;
term.defaultColor( 'Hit CTRL-C to quit.\n\n' ) ;






function listenToButton(bdAddr) {
	var cc = new FlicConnectionChannel(bdAddr);
	flic.addConnectionChannel(cc);
	cc.on("buttonUpOrDown", function(clickType, wasQueued, timeDiff) {
		console.log(bdAddr + " " + clickType + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");
		if (clickType === 'ButtonUp' && !wasQueued) {
			postToSlack();
		}
	});
	cc.on("connectionStatusChanged", function(connectionStatus, disconnectReason) {
		console.log(bdAddr + " " + connectionStatus + (connectionStatus == "Disconnected" ? " " + disconnectReason : ""));
	});
}

flic.on("bluetoothControllerStateChange", function(state) {
	console.log("Bluetooth controller state change: " + state);
});

flic.on("newVerifiedButton", function(bdAddr) {
	console.log("A new button was added: " + bdAddr);
	listenToButton(bdAddr);
});

flic.on("error", function(error) {
	console.log("Daemon connection error: " + error);
});

flic.on("close", function(hadError) {
	console.log("Connection to daemon is now closed");
});

function postToSlack() {
	leds.status.turnOff();
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
				leds.status.blink();
			});
		}
	});
}