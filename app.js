var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var morgan = require('morgan');
var users = {};

server.listen(3000);
app.use(morgan('dev'));
console.log("Chat server running on port 3000....");

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
res.sendFile(__dirname + "public/index.html");
console.log('showing index.html');
});

app.get('/privateMessaging.html',function(req,res){
res.sendFile(__dirname + "public/privateMessaging.html");
console.log('showing privateMessaging.html');
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
			//window.open('/index.html?name='+socket.nickname);
			updateUserList();
		}
	});
	
	function updateUserList(){
		var keys = Object.keys(users);
		/* var values;
		for (var i = 0; i < keys.length; i++) {
			 values = users[keys[i]];
		}
		console.log(keys);
		console.log(values); */
		//socket.broadcast.emit('usernames', keys, values);
		io.sockets.emit('usernames', keys);
		//console.log(JSON);
		//console.log(JSON.stringify(users));
		//io.sockets.emit('usernames',users);
		
	}

	socket.on('get user',function(data){
		// vary the unique names
		var limitOfUniqueNames = 1000;
		for(var i = 0; i<limitOfUniqueNames; i++)
		{
			name = data + i.toString();
			if(name in users){
				continue;			
			} else{
			console.log(name + ' user can be added');
			socket.emit('get user result', name);
			break;
			}
		}
	});
	
	socket.on('count users',function(){
		var count = Object.keys(users).length;
		socket.emit('count users result', count);
	});
	
	socket.on('chat msg',function(data,callback){
		console.log('data = ' +data);
		var msg = data.trim();
		console.log(msg);
		if(msg.substr(0,3) ==='/w '){
			msg = msg.substr(3);
			var ind = msg.indexOf(' ');
			if(ind != '-1'){
				var name = msg.substring(0,ind);
				console.log('name = ' +name);
				var msg = msg.substring(ind+1);
				console.log('msg = ' +msg);
				console.log('socket.nickname = '+socket.nickname);
				if(name in users){
					users[name].emit('Whisper', {nick : name, msg : msg});
					console.log('socket.nickname = '+users[name].nickname);
					//socket.emit('socket info', users[name]);
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
	
	socket.on('private chat msg',function(data,callback){
		if(data != null)
		{
		console.log('data = ' +data);
		var msg = data.trim();
		console.log(msg);
		if(msg.substr(0,3) ==='/w '){
			msg = msg.substr(3);
			var ind = msg.indexOf(' ');
			if(ind != '-1'){
				var name = msg.substring(0,ind);
				console.log('name = ' +name);
				var msg = msg.substring(ind+1);
				console.log('msg = ' +msg);
				console.log('socket.nickname = '+socket.nickname);
				if(name in users){
					users[name].emit('Whisper', {nick : name, msg : msg});
					console.log('socket.nickname = '+users[name].nickname);
					//socket.emit('socket info', users[name]);
					console.log('whisper');
					callback({error: 0,nick : name, msg : msg});
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