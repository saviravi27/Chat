var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var morgan = require('morgan');
var nicknames = [];

server.listen(3000);
app.use(morgan('dev'));
console.log("Chat server running on port 3000....");

app.get('/',function(req,res){
res.sendFile(__dirname + "/index.html");
console.log('showing index.html');
});

io.sockets.on('connection',function(socket){
	console.log('connection established for socket: ');
	//console.log('connection established for socket: ', socket);
	socket.on('new user',function(data,callback){
		if(nicknames.indexOf(data) != -1){
			console.log(data + ' user already exist');
			callback(false);
		} else{
			console.log(data + ' user added');
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			updateUserList();
		}
	});

	function updateUserList(){
		io.sockets.emit('usernames',nicknames);
	}

	socket.on('chat msg',function(data){
		io.sockets.emit('new msg', {nick : socket.nickname, msg : data});
		console.log('nick: '+socket.nickname+ '<br/>msg:'+data);
	});

	socket.on('disconnect',function(data){
		if(!socket.nickname){
			return;
		}
		nicknames.splice(nicknames.indexOf(data),1);
		updateUserList();
		console.log(data + ' user disconnected');
	});
})