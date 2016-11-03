var p = document.createElement("canvas")
p.width=32;
p.height=16;
var pctx=p.getContext('2d');

var x0=36;
var x1=-4;
var y0=-2;
var y1=18;
var offset=32;

pctx.strokeStyle = "#FF8877";
pctx.lineWidth=4;
pctx.beginPath();
pctx.moveTo(x0,y0);
pctx.lineTo(x1,y1);
pctx.moveTo(x0-offset,y0);
pctx.lineTo(x1-offset,y1);
pctx.moveTo(x0+offset,y0);
pctx.lineTo(x1+offset,y1);
pctx.stroke();
console.log("Patterns successfully created")