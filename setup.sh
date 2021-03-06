if type node > /dev/null; then
  npm install
  read -p 'Enter the Slack API token for the team you want to use: ' slack_api_token
  read -p 'Enter the default Slack channel to post to if none is specified: #' slack_default_channel
  read -p 'Enter a name for the whiteboard (e.g. "board room whiteboard"): ' whiteboard_name

  echo "const config = {
  slackApiToken: '$slack_api_token',
  slackApiToken: '$slack_default_channel',
  whiteboardName: '$whiteboard_name'
}

module.exports = config" > config.js
  
  echo 'Whiteboard config saved.'
  npm start
fi
