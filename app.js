
/**
 * Module dependencies.
 */
// need to take actual IP
HOST = "localhost";
PORT = "3001";

var express = require('express')
  , routes = require('./routes')
  , drawing = require('./routes/drawing')
  , http = require('http')
  , path = require('path')
  , redis = require('redis');


var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || PORT);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/drawing/:drawingid', drawing.start);


var httpServer = http.createServer(app);

httpServer.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(httpServer);

io.enable('log level' , 1);

io.sockets.on('connection', function(socket) {
 // const redisSubscriber = redis.createClient();
 // const redisPublisher = redis.createClient();
    const redisClient = redis.createClient();

  socket.on('publish', function(channel, data) {
//     console.log('publish function is called on channel :'+channel+' with data :'+JSON.stringify(data));
     redisClient.rpush(channel, JSON.stringify(data)); 
     socket.broadcast.to(channel).emit('message', data);
     //redisPublisher.publish(channel, data);
  });

  socket.on('subscribe', function(channel) {
     //console.log('subscribe function is called on channel :'+channel);
     //redisSubscriber.subscribe(channel);
     socket.join(channel);
     //iterate the previous messages of this channel
     redisClient.lrange(channel, 0, -1, function(err, data) {

//	 console.log('previous messages on this channel :'+channel+', data: '+data+', length:'+data.length);
	if(data && data.length > 0) {
	   data.forEach(function(reply) {
	         socket.emit('message', JSON.parse(reply));
	  });
	}       	

     });  
  });

/*
  redisSubscriber.on('message', function(channel, message) {
        console.log('redis callback message function is called with message :'+JSON.stringify(message));
 	//socket.emit('message', {channel: channel, data: message});
 	//socket.emit('message',  message);
        //socket.broadcast.to(channel).emit('message', data);
  });
*/

});



