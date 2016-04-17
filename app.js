var express = require("express"),
	app = express(),
	http = require("http").Server(app);
var io = require('socket.io').listen(http);

app.use(express.static(__dirname+"/public"));
http.listen(process.env.PORT || 3000);
console.log("server starting");

io.sockets.on("connection",function(socket){
	//投稿
	socket.on("emit_from_client_tweet",function(data){
		if(data.msg!=""){
			socket.broadcast.to(data.room).emit("emit_from_server","["+data.name+"] : "+data.msg);
			socket.emit("emit_from_server","["+data.name+"] : "+data.msg);
			console.log(data.name+" : "+data.msg);
		}
	});
	//部屋参加
	socket.on("emit_from_client_in",function(data){
		socket.join(data.room);
		socket.emit("emit_from_server",data.name+"さんがログインしました");
		socket.broadcast.to(data.room).emit("emit_from_server",data.name+"さんがログインしました");
		socket.emit("inroom",data.name);
		socket.emit("inroom2",data.room);
	});

});
