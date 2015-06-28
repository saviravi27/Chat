var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var morgan = require('morgan');

server.listen(3000);
app.use(morgan('dev'));
console.log("Chat server running on port 3000....");

app.get('/',function(req,res){
res.sendFile(__dirname + "/index.html");
});

io.sockets.on('connection',function(socket){
	socket.on('chat msg',function(data){
		io.sockets.emit('new msg', data);
	})
})