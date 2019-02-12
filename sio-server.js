// Example 2: adds user input and detects intents.
var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app).listen(3000);
var io = require("socket.io")(server);
var AssistantV1 = require('watson-developer-cloud/assistant/v1');

app.use(express.static("./public"));

// Set up Assistant service wrapper.
var service = new AssistantV1({
    username: 'UBPKkDmopL1nAvlE1EvJJQ7VWGRt3QC5wTTKztRB4N2h', // replace with service username
    password: 'UBPKkDmopL1nAvlE1EvJJQ7VWGRt3QC5wTTKztRB4N2h', // replace with service password
    version: '2019-02-06'
});
var workspace_id = '7745f5a4-5b87-4274-a58f-88617380c754'; // replace with workspace ID

io.on("connection", function (socket) {
    //send a message to watson and get the response and send the response to the client connected on this event.
    service.message({
        workspace_id: workspace_id
    }, function (err, response) {
        if (err) {
            console.error(err); // something went wrong
            socket.emit("disconnected", "Bot Not available");
        } else if (response.output.text.length != 0) {
            socket.contextId=response.context;
            console.log(response.context.conversation_id);
            socket.emit("server message", response.output.text[0]);
        }
    });

    socket.on("client message", function (message) {
        service.message({
            workspace_id: workspace_id,
            input: { text: message },
            context: sanitizedContext(socket.contextId)
        }, function (err, response) {
            console.log("watson response ", JSON.stringify(response, null, 2))
            if (err) {
                console.error(err); // something went wrong
                return;
            }

            // If an intent was detected, log it out to the console.
            if (response.intents.length > 0) {
                console.log('Detected intent: #' + response.intents[0].intent);
            }

            // Display the output from dialog, if any.
            if (response.output.text.length != 0) {
                socket.contextId=response.context;
                socket.emit("server message", response.output.text[0]);
            }
        });
    });

});
function sanitizedContext(context) {
    // function to remove all context variables from context, there might not be a context object so we'll try it first!
    try {
      const newContext = context
      delete newContext.buttons
      delete newContext.link
      delete newContext.camera
      delete newContext.command
      return newContext
    }
    catch (e) {
      return {}
    }
  }



