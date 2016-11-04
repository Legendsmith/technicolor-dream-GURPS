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

var p2 = document.createElement("canvas")
p2.width=16;
p2.height=16;
var pctx2=p2.getContext('2d');

var x0=-2;
var x1=18;
var y0=-2;
var y1=18;
var offset=16;

pctx2.strokeStyle = "#77DD66";
pctx2.lineWidth=4;
pctx2.beginPath();
pctx2.moveTo(x0,y0);
pctx2.lineTo(x1,y1);
pctx2.moveTo(x0-offset,y0);
pctx2.lineTo(x1-offset,y1);
pctx2.moveTo(x0+offset,y0);
pctx2.lineTo(x1+offset,y1);
pctx2.stroke();
console.log("Patterns successfully created")