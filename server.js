var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', function (req, res) {
  res.sendFile('/Users/aaryanpatnaik/Documents/Projects/Node/School/index.htm');
});

users = [];

fs.readFile('exam.txt', 'utf8', function (err, data) {
  if (err) throw err;
  console.log('OK: ' + 'exam.txt');
  examcontent = data;
});

const date = new Date();

io.on('connection', function (socket) {

  socket.on('setUsername', function (data) {
    console.log(data);

    if (users.indexOf(data) > -1) {
      socket.emit('userExists', data + ' username is taken! Try some other username.');
    }
    else {
      users.push(data);
      socket.emit('userSet', { username: data });
      socket.emit('examcontent', examcontent);
      users[socket.id] = data;
    }
  });

  socket.on('login', function (data) {
    let now = new Date();
    let output = "[" + `${now.toTimeString().split(" ")[0]}` + "] " + data + " has logged in!";

    console.log(output)
    fs.appendFile(`/Users/aaryanpatnaik/Documents/Projects/Node/School/examlog.txt`, '\r\n' + output, err => {
      if (err) {
        console.error(err)
        return
      }
    })
  });

  socket.on('submitexam', function (data) {
    let now = new Date();
    let output = "[" + `${now.toTimeString().split(" ")[0]}` + "] " + data.user + " has submitted!";

    console.log(output)
    fs.appendFile(`/Users/aaryanpatnaik/Documents/Projects/Node/School/examlog.txt`, '\r\n' + output, err => {
      if (err) {
        console.error(err)
        return
      }
    })

    fs.writeFile(`/Users/aaryanpatnaik/Documents/Projects/Node/School/${data.user}'s paper.txt`, data.submission, err => {
      if (err) {
        console.error(err)
        return
      }
      else {
        socket.emit('finishexam', data.user)
      }
    })

  });

  socket.on('disconnect', function () {
    let now = new Date();
    let output = "[" + `${now.toTimeString().split(" ")[0]}` + "] " + users[socket.id] + " has logged off";

    if (users[socket.id] != undefined && users[socket.id] != null) {
      console.log(output)

      fs.appendFile(`/Users/aaryanpatnaik/Documents/Projects/Node/School/examlog.txt`, '\r\n' + output, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }

    delete users[socket.id];
  });

  socket.on('studentnotfocused', function (data) {
    if (data.isFocused == true && data.student != null && data.student != undefined) {
      let now = new Date();
      let output = "[" + `${now.toTimeString().split(" ")[0]}` + "] " + data.student + "'s tab is in focus.";
      console.log(output)
      fs.appendFile(`/Users/aaryanpatnaik/Documents/Projects/Node/School/examlog.txt`, '\r\n' + output, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
    else {
      let now = new Date();
      let output = "[" + `${now.toTimeString().split(" ")[0]}` + "] " + data.student + "'s tab is out of focus.";
      console.log(output)
      fs.appendFile(`/Users/aaryanpatnaik/Documents/Projects/Node/School/examlog.txt`, '\r\n' + output, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })
});

http.listen(3000, function () {
  console.log('listening on localhost:3000');
});

// TODO: Set time for exam by using DateTime and comparing it with DateTime.Now(), then using textarea's readonly property we can
// disable the textarea until the time requirement is met. We can do this by every 5 seconds checking if it has been time.