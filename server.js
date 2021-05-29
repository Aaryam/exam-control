var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile('/Users/aaryanpatnaik/Documents/Projects/Node/School/index.htm');
});

users = [];
io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on('setUsername', function (data) {
        console.log(data);

        if (users.indexOf(data) > -1) {
            socket.emit('userExists', data + ' username is taken! Try some other username.');
        } else {
            users.push(data);
            socket.emit('userSet', { username: data });
        }
    });

    socket.on('msg', function (data) {
        io.sockets.emit('newmsg', data);
    })

    socket.on('disconnect', function (socket) {
        console.log('A user disconnected')
    });
});

http.listen(3000, function () {
    console.log('listening on localhost:3000');
});