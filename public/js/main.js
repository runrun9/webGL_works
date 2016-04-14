var inroom=0;
function Cchange(x){
  var Bodycolor=document.getElementById('body');
  if(x==1){
    Bodycolor.style.backgroundColor = "lavender";
  }else if(x==2){
    Bodycolor.style.backgroundColor = "lightsalmon";
  }else if(x==3){
    Bodycolor.style.backgroundColor = "skyblue";
  }
}

//以下socket.io
$(function(){
  var socket = io.connect();
  var clientname="no name";

  //入室
  $("#roomForm").submit(function(e){
    e.preventDefault();
    socket.json.emit("emit_from_client_in",{
      room: $("#rooms").val(),
      name: $("#name").val()
    });
    inroom=$("#rooms").val();
  });
  //投稿
  $("#myForm").submit(function(e){
    if(inroom!=0){
      e.preventDefault();
      socket.json.emit("emit_from_client_tweet",{
        msg: $("#msg").val(),
        name: clientname,
        room:	inroom
      });
      $("#msg").val("").focus();
    }
  });

  //入室処理
  socket.on("inroom",function(data){
    $("#roomForm").remove();
    $("#clientname").text("name: "+data);
    clientname=data;
  });
  socket.on("inroom2",function(data){
    $("#roomname").text("room: "+data);
  });
  // 投稿表示
  socket.on("emit_from_server",function(data){
    if(inroom!=0){
      $("#logs").append($("<li class='hatugen'>").text(data));
      $('.hatugen:last').textFx({
        type: 'slideIn', //動きfadeIn  slideIn  rotate  scale
        iChar: 70, //文字間の表示間隔
        iAnim: 500, //アニメーションの速度
        direction: 'top' //現れる方向slideのみ
      });
    }
  });

});
