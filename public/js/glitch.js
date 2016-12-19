function glitchBox(canvas){
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.width = canvas.width;
  this.height = canvas.height;
}

glitchBox.prototype.drawImage = function(img, x, y){
    this.canvas.getContext("2d").drawImage(img, x, y);
};

glitchBox.prototype.glitchFillRandom = function(fillCnt, cuttingMaxHeight){
  var cw = this.width;
  var ch = this.height;
  for(var i = 0; i< fillCnt; i++){
    var rndX = cw * Math.random();
    var rndY = ch * Math.random();
    var rndW = cw * Math.random();
    var rndH = cuttingMaxHeight * Math.random();
    var image = this.ctx.getImageData(rndX,rndY,rndW, rndH);
    this.ctx.putImageData(image, (rndX* Math.random())%cw, rndY);
  };
}
