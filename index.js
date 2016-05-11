var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var request = require('request');
//var response = require('response');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'spotopp_token') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});


app.post('/webhook/', jsonParser, function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i]; //entry will have subscription to pages..if 1 page then entry[0]
	
    sender = event.sender.id;
	
    if (event.message && event.message.text) {
      text = event.message.text;
	  console.log("messeage Received: " + text);
	  sendGenericMessage(sender ,text);
      //sendTextMessage(sender, " "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

//Replace your Page Token here. The page token can be obtained from the Facebook App
var token = "xxxx";


function sendGenericMessage(sender,text) {
     // this is where you send it to nlp engine     
    messageData = '{"text" : "Hi. This is Bot here. I am still learning. Will be able to give you a meaningful reply in my next Demo."}';
    //messageData = {text:text};
	
	console.log(messageData);
        
request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: JSON.parse(messageData),
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
           
 }






app.listen(80, function () {
  console.log('Example app listening on port 80!');
});
