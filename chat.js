var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8000, function () {
	
})

// Socket.io server listens to our app
var io = require('socket.io').listen(server);

var users = [];
// Emit welcome message on connection
io.on('connection', function(socket) {
	console.log("connected !!");
	
	var msg = [
			{
				message:'a'
			},
			];
	
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('start_message', { user:users, id:socket.id });

    socket.on('reg_user', function(data){
		var t = true;
		for (u of users) {
			if(u.user == (data.user))
				t = false;
		} 
		
		if(t)
			users.push({id:socket.id, user:data.user});
		
		io.emit('update_user', {
			user:users,
		});
	});
	
    socket.on('send_message', function(data){
		console.log(data);
		io.emit('new_message', {
			msg:data.msg_chat,
			user:data.user_chat,
			time:data.time_chat
		});
	});
	
	socket.on('disconnect', function() {
		console.log('Got disconnect!');
		users = users.filter(user => user.id !== socket.id)
		
		io.emit('update_user', {
			user:users,
		});
	});
});
