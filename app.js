var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var morgan = require('morgan');
var users = {};

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
		if(data in users){
			console.log(data + ' user already exist');
			callback(false);
		} else{
			console.log(data + ' user added');
			callback(true);
			socket.nickname = data;
			users[socket.nickname] = socket;
			updateUserList();
		}
	});

	function updateUserList(){
		io.sockets.emit('usernames',Object.keys(users));
	}

	socket.on('chat msg',function(data,callback){
		var msg = data.trim();
		if(msg.substr(0,3) ==='/w '){
			msg = msg.substr(3);
			var ind = msg.indexOf(' ');
			if(ind != '-1'){
				var name = msg.substring(0,ind);
				var msg = msg.substring(ind+1);
				if(name in users){
					users[name].emit('Whisper', {nick : socket.nickname, msg : msg});
					console.log('whisper');
				}
				else{
					callback('Error : Enter valid username');
				}	
			}
			else{
				callback('Error : Please enter a message to whisper');
			}
		}
		else{
		io.sockets.emit('new msg', {nick : socket.nickname, msg : msg});
		console.log('nick: '+socket.nickname+ '<br/>msg:'+data);
	    }
	});

	socket.on('disconnect',function(data){
		if(!socket.nickname){
			return;
		}
		delete users[socket.nickname];
		updateUserList();
		console.log(data + ' user disconnected');
	});
})