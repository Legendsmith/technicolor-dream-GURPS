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

var gradone = document.createElement('canvas')//gradient for main body/outline
gradone.width=601
gradone.height=1
var gctx = gradone.getContext('2d');
var grd = gctx.createLinearGradient(0,0,601,0)
grd.addColorStop(0,'purple')
grd.addColorStop(0.9,'red')
grd.addColorStop(1,'green')
gctx.fillStyle=grd
gctx.fillRect(0,0,601,1)

function gradGet(n){
	var x = Math.floor(600*n)
	var id = gctx.getImageData(x,0,1,1).data
	return  `rgb(${id[0]},${id[1]},${id[2]})`
}

var gradtwo = document.createElement('canvas') //gradient for the limbs and main, solid parts
gradtwo.width=221
gradtwo.height=1
var gctx2 = gradtwo.getContext('2d');
var grd = gctx2.createLinearGradient(0,0,221,0)
grd.addColorStop(0,'purple')
grd.addColorStop(0.7,'red')
grd.addColorStop(1,'#8ae234')
gctx2.fillStyle=grd
gctx2.fillRect(0,0,221,1)

function gradtwoGet(n){
	var x = Math.floor(220*n)
	var id = gctx2.getImageData(x,0,1,1).data
	return  `rgb(${id[0]},${id[1]},${id[2]})`
}

var gradthree = document.createElement('canvas') //gradient for the advanced hit locations
gradthree.width=221
gradthree.height=1
var gctx3 = gradthree.getContext('2d');
var grd = gctx3.createLinearGradient(0,0,221,0)
grd.addColorStop(0,'purple')
grd.addColorStop(0.7,'red')
grd.addColorStop(1,'#729fcf')
gctx3.fillStyle=grd
gctx3.fillRect(0,0,221,1)

function gradthreeGet(n){
	var x = Math.floor(220*n)
	var id = gctx3.getImageData(x,0,1,1).data
	return  `rgb(${id[0]},${id[1]},${id[2]})`
}

console.log("Patterns & Gradients successfully created")