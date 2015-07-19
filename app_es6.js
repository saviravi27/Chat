const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const morgan = require('morgan');
const users = {};
server.listen(3000);
app.use(morgan('dev'));
console.log('Chat server running on port 3000....');
app.use(express.static(`${ __dirname }/public`));
app.get('/', (req, res) => {
    res.sendFile(`${ __dirname }public/index.html`);
    console.log('showing index.html');
});
app.get('/privateMessaging.html', (req, res) => {
    res.sendFile(`${ __dirname }public/privateMessaging.html`);
    console.log('showing privateMessaging.html');
});
io.sockets.on('connection', socket => {
    console.log('connection established for socket: ');
    //console.log('connection established for socket: ', socket);
    socket.on('new user', (data, callback) => {
        if (data in users) {
            console.log(`${ data } user already exist`);
            callback(false);
        } else {
            console.log(`${ data } user added`);
            callback(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            //window.open('/index.html?name='+socket.nickname);
            updateUserList();
        }
    });
    function updateUserList() {
        const keys = Object.keys(users);
        /* var values;
		for (var i = 0; i < keys.length; i++) {
			 values = users[keys[i]];
		}
		console.log(keys);
		console.log(values); */
        //socket.broadcast.emit('usernames', keys, values);
        io.sockets.emit('usernames', keys);    //console.log(JSON);
                                               //console.log(JSON.stringify(users));
                                               //io.sockets.emit('usernames',users);
    }
    socket.on('get user', data => {
        // vary the unique names
        const limitOfUniqueNames = 1000;
        for (var i = 0; i < limitOfUniqueNames; i++) {
            name = data + i.toString();
            if (name in users) {
                continue;
            } else {
                console.log(`${ name } user can be added`);
                socket.emit('get user result', name);
                break;
            }
        }
    });
    socket.on('count users', () => {
        const count = Object.keys(users).length;
        socket.emit('count users result', count);
    });
    socket.on('chat msg', (data, callback) => {
        console.log(`data = ${ data }`);
        let msg = data.trim();
        console.log(msg);
        if (msg.substr(0, 3) === '/w ') {
            msg = msg.substr(3);
            const ind = msg.indexOf(' ');
            if (ind != '-1') {
                const name = msg.substring(0, ind);
                console.log(`name = ${ name }`);
                const msg = msg.substring(ind + 1);
                console.log(`msg = ${ msg }`);
                console.log(`socket.nickname = ${ socket.nickname }`);
                if (name in users) {
                    users[name].emit('Whisper', {
                        nick: name,
                        msg: msg
                    });
                    console.log(`socket.nickname = ${ users[name].nickname }`);
                    //socket.emit('socket info', users[name]);
                    console.log('whisper');
                } else {
                    callback('Error : Enter valid username');
                }
            } else {
                callback('Error : Please enter a message to whisper');
            }
        } else {
            io.sockets.emit('new msg', {
                nick: socket.nickname,
                msg: msg
            });
            console.log(`nick: ${ socket.nickname }<br/>msg:${ data }`);
        }
    });
    socket.on('private chat msg', (data, callback) => {
        if (data != null) {
            console.log(`data = ${ data }`);
            let msg = data.trim();
            console.log(msg);
            if (msg.substr(0, 3) === '/w ') {
                msg = msg.substr(3);
                const ind = msg.indexOf(' ');
                if (ind != '-1') {
                    const name = msg.substring(0, ind);
                    console.log(`name = ${ name }`);
                    const msg = msg.substring(ind + 1);
                    console.log(`msg = ${ msg }`);
                    console.log(`socket.nickname = ${ socket.nickname }`);
                    if (name in users) {
                        users[name].emit('Whisper', {
                            nick: name,
                            msg: msg
                        });
                        console.log(`socket.nickname = ${ users[name].nickname }`);
                        //socket.emit('socket info', users[name]);
                        console.log('whisper');
                        callback({
                            error: 0,
                            nick: name,
                            msg: msg
                        });
                    } else {
                        callback('Error : Enter valid username');
                    }
                } else {
                    callback('Error : Please enter a message to whisper');
                }
            } else {
                io.sockets.emit('new msg', {
                    nick: socket.nickname,
                    msg: msg
                });
                console.log(`nick: ${ socket.nickname }<br/>msg:${ data }`);
            }
        }
    });
    socket.on('disconnect', data => {
        if (!socket.nickname) {
            return;
        }
        delete users[socket.nickname];
        updateUserList();
        console.log(`${ data } user disconnected`);
    });
});