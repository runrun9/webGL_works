var express = require("express"),
	app = express(),
	http = require("http").Server(app);
var io = require('socket.io').listen(http);

app.use(express.static(__dirname+"/public"));
http.listen(process.env.PORT || 3000);
console.log("server starting");

io.sockets.on("connection",function(socket){
	socket.on("emit_from_client_tweet",function(data){
		if(data.msg!=""){
			io.sockets.emit("emit_from_server","["+data.name+"] : "+data.msg);
		}

	});
	socket.on("emit_from_client_in",function(data){
		socket.join(data.room);
		socket.emit("emit_from_server","you are in "+data.room);
		socket.broadcast.to(data.room).emit("emit_from_server",data.name+"さんがログインしました");
		socket.emit("inroom",data.name);
		socket.emit("inroom2",data.room);
	});
});
