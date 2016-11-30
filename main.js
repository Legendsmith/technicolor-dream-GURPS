var currentTab = "";
///shortcuts
function getId(str){ //jquer broke everything so lol here we go.
  return document.getElementById(str)
}


chara = function(){ //this serves as a shortcut for writing out that long as sl namelist thing over and over.
  return dotrack[sl_namelist.value]
}

//tabs
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
    currentTab = tabName;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    getId(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
getId('defaultOpen').click()

//setup


var btns = document.getElementsByTagName('button');
for (var i = btns.length - 1; i >= 0; i--) {
  btns[i].disabled=true
};

btn_init.disabled=false
if(localStorage.tcdg){
  btn_load.disabled=false
}
init = false
supportcheck();
rn_mov.disabled =true
///patterns
var dotrack = {}
var status = ""
var cvs = getId("display")
var ctx = cvs.getContext("2d");
//canvas
function cvssetup(_fp){
  var fontscale = getId("display").height/875
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle="#000000"
  ctx.font= `${round(Math.max(32*fontscale,8))}px Arial`;
  ctx.fillText("FP",30,32)
  ctx.font= `${round(Math.max(18*fontscale,8))}px Arial`;
  ctx.translate(0,72 * Math.max(getId("display").height/875),0.5)
  var dsplyhght =(cvs.height - 85) //height minus the big FP
    for (var i = _fp*2; i >= 0; i--) {
    var _x = 5
    var _y = (dsplyhght-(dsplyhght/(_fp*2) * i))+6
    ctx.fillText((-_fp)+i,_x,_y);
  }
}
//dice
      var rolldice = function(){ console.log("Something went very wrong with dice function"); return 0}
      //use crypto random if browser supports it, otherwise fall back to awful js random
      if(typeof window.crypto.getRandomValues !== 'undefined'){
        console.log("cryptorandom active");
        rolldice = function(){
          var array = new Uint8ClampedArray(3);
          window.crypto.getRandomValues(array);
          var r = 0
          for (var i = 0; i < array.length; i++) {
            r += Math.ceil(array[i]/255 *6)
          }
          return r
        }
      }else{
        console.log("awful js random active")
        rolldice = function(){
          return Math.floor((Math.random() * 6) + 1) + Math.floor((Math.random() * 6) + 1) + Math.floor((Math.random() * 6) + 1)}
      }


window.onresize = function(){
  if(init){cvsdisplay()}
}

function cvsdisplay(){
  //scale code
  getId("display").style.height = Math.min(window.innerHeight,875)+"px"
  getId("display").height = Math.min((window.innerHeight*0.95),875)
  var fontscale = getId("display").height/875
  //scale code
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.translate(0,72 * Math.max(getId("display").height/875),0.5)
  var dsplyhght =(cvs.height - 85)
  //
  //
  var sevblock_o = 0//SEVERE BLOCK origin
  var sevblock_size = 0
  if(chara().fprec<chara().fpmax){
    var mldtext_y = dsplyhght-(dsplyhght/chara().fpmax/2)*(chara().fpmax+chara().fprec) // it's actually the line of the fp point
    var mldblock_yo = Math.max(dsplyhght-((dsplyhght/chara().fpmax/2)*(chara().fpmax+chara().fprec+Math.floor(chara().fppoint))),0)
    var mildsize = Math.min(((dsplyhght/chara().fpmax/2)*(chara().fpmax-chara().fprec)),
      (dsplyhght/chara().fpmax/2)*chara().fppoint);
    //ctx.fillStyle="#"
    ctx.fillStyle=ctx.createPattern(p,'repeat');

    ctx.fillRect(25,mldblock_yo,80,mildsize);//MILD FATIGUE DRAW
    //severe block
    var sevblock_size = Math.max(dsplyhght-((dsplyhght/chara().fpmax/2)*(chara().fpmax+chara().fprec+Math.floor(chara().fppoint))),0)
    ctx.font= `${round(Math.max(16*fontscale,8))}px Arial`;
  }

  if(chara().fprec<0){//deep
    ctx.font= `${round(Math.max(15*fontscale,8))}px Arial`;
    ctx.fillStyle="Purple";
    ctx.fillRect(25,0,80,(dsplyhght/chara().fpmax/2)*Math.abs(chara().fprec))
    sevblock_o = (dsplyhght/chara().fpmax/2)*Math.abs(chara().fprec)
    sevblock_size += (dsplyhght/chara().fpmax/2)*chara().fprec //reduce the size of the severe block
  }
  if(chara().fprec<(chara().fpmax-chara().fppoint)){ //severe block actual drawing
    ctx.font= `bold ${round(Math.max(16*fontscale,8))}px Arial`;
    ctx.fillStyle="#FF9999"
    ctx.fillRect(25,sevblock_o,80,sevblock_size)
  };
  //fp recovery block
  var fprecsize = (dsplyhght-(dsplyhght/chara().fpmax/2)*(chara().fpmax+chara().fprec)) - (dsplyhght-(dsplyhght/chara().fpmax/2)*(chara().fpmax+chara().fp))
  ctx.fillStyle = ctx.createPattern(p2,'repeat');
  ctx.fillRect(25,(dsplyhght-(dsplyhght/chara().fpmax/2)*(chara().fpmax+chara().fp)),80,fprecsize)
  ctx.strokeStyle = "#77DD66";
  ctx.lineWidth =3
  ctx.beginPath()
  ctx.moveTo(25,(dsplyhght-(dsplyhght/chara().fpmax/2)*(chara().fpmax+chara().fp)))
  ctx.lineTo(105,(dsplyhght-(dsplyhght/chara().fpmax/2)*(chara().fpmax+chara().fp)))
  ctx.closePath()
  ctx.stroke()
  //TEXT
  if(chara().fprec<chara().fpmax){//mild
    ctx.fillStyle="#000000";
    ctx.font= `${round(Math.min(16*fontscale,8))}px Arial`;
    ctx.fillText("Mild",110,mldtext_y-((mldtext_y - mldblock_yo)/2)+6)
    ctx.font= `bolder ${round(Math.max(16*fontscale,8))}px Arial`;
    ctx.strokeStyle="#FFFFFF";
    ctx.strokeText((Math.floor(((20/chara().fpmax)*chara().fittime)*100)/100),60,mldtext_y-((mldtext_y - mldblock_yo)/2)-8)//MILD FATIGUE DRAW TEXT
    ctx.strokeText("hours/FP",32,mldtext_y-((mldtext_y - mldblock_yo)/2)+8)
    ctx.font= `bold ${round(Math.max(16*fontscale,8))}px Arial`;
    ctx.fillText((Math.floor(((20/chara().fpmax)*chara().fittime)*100)/100),60,mldtext_y-((mldtext_y - mldblock_yo)/2)-8)
    ctx.fillText("hours/FP",32,mldtext_y-((mldtext_y - mldblock_yo)/2)+8)

  }
  if(chara().fprec<(chara().fpmax-chara().fppoint)){//SEVERE
    ctx.fillStyle="#000000";
    ctx.fillText(Math.floor(((80/chara().fpmax)*chara().fittime)*100)/100,60,sevblock_o+(sevblock_size/2)-8)
    ctx.fillText("hours/FP",32,sevblock_o+(sevblock_size/2)+8)
    ctx.font= `${round(Math.max(12*fontscale,8))}px Arial`;
    ctx.fillText("Severe",108,sevblock_o+(sevblock_size/2))

  };
  if(chara().fprec<0){ // deep
    ctx.fillText("Deep",110,((dsplyhght/chara().fpmax/2)*Math.abs(chara().fprec)/2))
    ctx.font= `bold ${round(Math.max(16*fontscale,8))}px Arial`;
    ctx.fillStyle="#EEEEEE";
    ctx.fillText((Math.floor(((240/chara().fpmax)*chara().fittime)*100)/100),60,((dsplyhght/chara().fpmax/2)*Math.abs(chara().fprec)/2)-8)
    ctx.fillText("hours/FP",32,((dsplyhght/chara().fpmax/2)*Math.abs(chara().fprec)/2)+8)
  };


  //main FP bar
  if(chara().fprec>0){ctx.fillStyle="#99ff33";}else{ctx.fillStyle="#77CC22"}//colour of the main FP bar
  ctx.fillRect(25, dsplyhght-(dsplyhght/chara().fpmax/2)*(chara().fpmax+chara().fprec),80,cvs.height)
  cvssetup(chara().fpmax);

}

//I know this is hacky but vOv
cb_fit.onchange=function(){
  if (getId("cb_fit").checked== true){
    getId("cb_vfit").checked=false
    getId("cb_ufit").checked=false
    getId("cb_vufit").checked=false
  }
}
cb_vfit.onchange=function(){
  if (getId("cb_vfit").checked == true){
    getId("cb_fit").checked=false
    getId("cb_vufit").checked=false
    getId("cb_ufit").checked=false
  }
}
cb_ufit.onchange=function(){
  if (getId("cb_ufit").checked == true){
    getId("cb_fit").checked=false
    getId("cb_vfit").checked=false
    getId("cb_vufit").checked=false
  }
}

cb_vufit.onchange=function(){
  if (getId("cb_vufit").checked == true){
    getId("cb_ufit").checked=false
    getId("cb_vfit").checked=false
    getId("cb_fit").checked=false
  }
}
in_enc.onchange=function(){
  update();
}
var currenthtbonus = 0
//fp and AP recovery quick buttons.
btn_app1.onclick=function(){
  chara().ap+=1
  update();
}
btn_apm1.onclick=function(){
  chara().ap-=1
  update();
}
btn_fpp1.onclick=function(){
  chara().fp+=1
  update();
}
btn_fpm1.onclick=function(){
  chara().fp-=1
  update();
}
//saving and loading
function supportcheck(){
        if (window.File && window.FileReader && window.FileList && window.Blob && init) {
          btn_fsave.disabled =false
          btn_fload.disabled =false
        }else if(window.File && window.FileReader && window.FileList && window.Blob){btn_fload.disabled =false} else {
          alert('The File APIs are not fully supported in this browser.');
          btn_fsave.disabled =true
          btn_fload.disabled =true
        }
}
function fsave(){
        var sav = LZString.compressToEncodedURIComponent(JSON.stringify(dotrack));
        var savBlob = new Blob([sav], {type:"text/plain"});
        var savAsURL = window.URL.createObjectURL(savBlob);
        var downloadLink = document.createElement("a");
        downloadLink.download = "tcdg_save";
        downloadLink.innerHTML = "Download File";
        downloadLink.href = savAsURL;
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
       
        downloadLink.click();
      }
      function destroyClickedElement(e)
      {
          document.body.removeChild(e.target);
}
btn_fsave.onclick = fsave
function fload(){
        getId('in_fload').click()
        var fileReader = new FileReader()
        fileReader.onload = function(floadEvent){
          var inp = floadEvent.target.result;
          load(inp,2)
}
        getId('in_fload').onchange = function(){
          if(typeof getId('in_fload').files[0] !== 'undefined'){
            var ftarget = getId('in_fload').files[0];
            fileReader.readAsText(ftarget,"UTF-8")
          };
        }
      }
btn_fload.onclick = fload

//buttons for AP recovery
btn_not.onclick=function(){
  currenthtbonus=4+chara().fitbon
  if(cb_rnd.checked){
    rollClient.get("https://www.random.org/integers/?num=3&min=1&max=6&col=1&base=10&format=plain&rnd=new",callbackRollHT)
    getId("txt_out").textContent = "Waiting for Random.org"
  }else{
    getId("txt_out").innerHTML = rollHT(rolldice());
  }
  //update ui and everything
  update();
}
btn_eva.onclick=function(){
  currenthtbonus=chara().fitbon
  if(cb_rnd.checked){
    rollClient.get("https://www.random.org/integers/?num=3&min=1&max=6&col=1&base=10&format=plain&rnd=new",callbackRollHT)
    getId("txt_out").textContent = "Waiting for Random.org"
  }else{
    getId("txt_out").innerHTML = rollHT(rolldice());
  }
    //update ui and everything
  update();
}

btn_injury.onclick=function(){
  if(cb_rnd.checked){
    rollClient.get("https://www.random.org/integers/?num=3&min=1&max=6&col=1&base=10&format=plain&rnd=new",callbackmitigate)
    getId("txt_out2").textContent = "Waiting for Random.org"
  }else{
    getId("txt_out2").innerHTML = rollmitigate(rolldice());
  }
  update();
}

function rollparse(_in){
  var rollarray=_in.split("\n")
  var _x =0
  for (i = 0; i < 3; i++){
    _x += parseInt(rollarray[i])
  }
  return _x
}
//injury callback for random.org


function callbackmitigate(_result){
  var _rroll = rollparse(_result);
  getId("txt_out2").innerHTML = rollmitigate(_rroll);
  update();
}

function rollmitigate(r){
  var op = "" //output
  var success = false
  var loss = parseInt(in_inj.value)
  var shock = Math.min(loss,4)//if the shock value is greater than 4, lower it to 4
  if(parseInt(in_jcap.value) > 0){loss=Math.min(loss,in_jcap.value)}
    
  if (r <= (chara().ht-shock)){
    success=true;
    loss -= ((chara().ht-shock) - r)
  }
  loss= Math.max(loss,0)

  if (success) {
    chara().ap -= round(loss / in_lossdiv.valueAsNumber)
    op = "<b style=\"color:green\">Success: "+r+" Lost "+loss+" AP</b>"
  }else{
    chara().ap -= loss 
    op="<b style=\"color:red\">Failure: "+r+" Lost "+loss+" AP</b>"
  }
  update();
  in_enc.value = chara().enc;
  return op
}


///HT callback for random.org
function callbackRollHT(_result){
  var _rroll = rollparse(_result);
  getId("txt_out").innerHTML = rollHT(_rroll);
  update();
}


//////////////random.org stuff//////////
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}
////////////////////////////////////////

function rollHT(r){
  var _bon = currenthtbonus
  var op = "" //output
  if (r <= (chara().ht + _bon)) {
    var aprecovered = 1 + Math.floor(((chara().ht + _bon) -r)/4)
    chara().ap += aprecovered;
    op = `<b style=\"color:green\">Success: ${r} Recovered ${aprecovered} AP</b>`
  }else{op=`<b style=\"color:red\">Failure: ${r}</b>`}
  return op
}

//buttons for AP use
btn_wnd.onclick=function(){
  chara().fp -=1
  chara().ap += Math.ceil(chara().htmax * 0.5)
  update();
}

///script begin.
dotrack.names = []
sl_namelist.onchange =  function(){
  //ti_name.value = sl_namelist.value
  update();
}

function updatenamelist(){
  //PERFORMANCE, WHAT PERFORMANCE? IMMEDIATE MODE FOREVER
  repopulatelist('sl_namelist', dotrack.names)
}

btn_init.onclick=function(){ //initialisation
  init = true
  if(dotrack.names.indexOf(ti_name.value)== -1){ // if the name isn't in the list, add it to the list.
    dotrack.names.push(ti_name.value) 
  }
  updatenamelist()
  dotrack[ti_name.value]={}
  dotrack[ti_name.value].fitbon = 0
  dotrack[ti_name.value].fittime =1
  dotrack[ti_name.value].notes = ""
  rollClient= new HttpClient();
  if(getId("cb_fit").checked){
    dotrack[ti_name.value].fitbon = 1
    dotrack[ti_name.value].fittime = 0.5
    dotrack[ti_name.value].notes = "Fit"
    console.log("fit bonus active")
  }else if(getId("cb_vfit").checked){
    dotrack[ti_name.value].fitbon = 2
    dotrack[ti_name.value].fittime = 0.5
    dotrack[ti_name.value].notes = "V. Fit"
    console.log("v. fit bonus active")
  }else if(getId("cb_ufit").checked){
    dotrack[ti_name.value].fitbon = -1
    dotrack[ti_name.value].fittime = 2
    dotrack[ti_name.value].notes = "Unfit"
    console.log("Unfit penalty active")
  }else if(getId("cb_vufit").checked){
    console.log("Very Unfit penalty active")
    dotrack[ti_name.value].fittime = 2
    dotrack[ti_name.value].fitbon = -2
    dotrack[ti_name.value].notes = "V. Unfit"
  }
  else{dotrack[ti_name.value].fitbon=0}
    dotrack[ti_name.value].name=ti_name.value
    dotrack[ti_name.value].stmax=in_ST.valueAsNumber;
    dotrack[ti_name.value].htmax =in_HT.valueAsNumber;
    dotrack[ti_name.value].iqmax =in_IQ.valueAsNumber;
    dotrack[ti_name.value].iq=dotrack[ti_name.value].iqmax;
    dotrack[ti_name.value].htmax =in_HT.valueAsNumber;
    dotrack[ti_name.value].ht =dotrack[ti_name.value].htmax
    dotrack[ti_name.value].blmax=parseInt(in_ST.value);
    dotrack[ti_name.value].apmax=parseInt(in_HT.value)+parseInt(in_AP.value);
    dotrack[ti_name.value].fpmax=parseInt(in_HT.value)+parseInt(in_FP.value);
    dotrack[ti_name.value].dxmax=parseInt(in_DX.value)
    dotrack[ti_name.value].dx=dotrack[ti_name.value].dxmax
    //dotrack[ti_name.value].movmax=((parseInt(dotrack[ti_name.value].dx)+parseInt(dotrack[ti_name.value].ht))/4)+parseInt(in_mov.value)
    dotrack[ti_name.value].spdmax= in_spd.valueAsNumber
    dotrack[ti_name.value].spd= in_spd.valueAsNumber
    dotrack[ti_name.value].spdmod = dotrack[ti_name.value].spdmax - ((dotrack[ti_name.value].ht + dotrack[ti_name.value].dx)/4)
    dotrack[ti_name.value].movmax=in_mov.valueAsNumber
    dotrack[ti_name.value].mov = dotrack[ti_name.value].movmax
    dotrack[ti_name.value].movmod = dotrack[ti_name.value].movmax - Math.floor((dotrack[ti_name.value].ht + dotrack[ti_name.value].dx)/4)
    dotrack[ti_name.value].ap = dotrack[ti_name.value].apmax
    dotrack[ti_name.value].st = dotrack[ti_name.value].stmax
    dotrack[ti_name.value].fp = dotrack[ti_name.value].fpmax
    dotrack[ti_name.value].fprec = dotrack[ti_name.value].fpmax
    dotrack[ti_name.value].st = dotrack[ti_name.value].stmax
    dotrack[ti_name.value].will = in_WILL.valueAsNumber
    dotrack[ti_name.value].willmax = in_WILL.valueAsNumber
    dotrack[ti_name.value].per = in_PER.valueAsNumber
    dotrack[ti_name.value].permax = in_PER.valueAsNumber
    dotrack[ti_name.value].fppoint = dotrack[ti_name.value].fpmax/2
    dotrack[ti_name.value].dodgepen = 0;
    dotrack[ti_name.value].skills=[];
    dotrack[ti_name.value].weapons=[];
    setupAnS();
    updateskilllist();
    sl_namelist.selectedIndex = sl_namelist.length-1
    calc();
    encumber();
    display();
    //enable buttons
    for (var i = btns.length - 1; i >= 0; i--) {
      btns[i].disabled=false
    };
    //canvas init
    cvsdisplay(dotrack[ti_name.value].fpmax);
    update();
    getId('txt_rnmov').textContent = getId('txt_rnmov').textContent = `${rn_mov.value} Cost: ${round((rn_mov.valueAsNumber/chara().mov)*10)} AP`
    rn_mov.disabled =false

}
//name list box


//ui callbacks
function movdo(){
  if(cb_mcv.checked){
      getId('txt_rnmov').textContent = `Velocity: ${rn_mov.value}`
      getId('txt_varmov').textContent = `Increase ${round((rn_mov.valueAsNumber/chara().mov/2)*10)} Decrease: ${Math.floor((rn_mov.valueAsNumber/chara().mov/3)*10)}`
      }else{
        getId('txt_varmov').textContent = `
`
        getId('txt_rnmov').textContent = `${rn_mov.value} Cost: ${round((rn_mov.valueAsNumber/chara().mov)*10)} AP`
       }
}

rn_mov.oninput=movdo

btn_updt.onclick=function(){
  chara().fp += parseInt(in_fps.value);
  chara().ap += parseInt(in_aps.value);
  update();
}

btn_apf.onclick=function(){
  chara().ap=chara().apmax
  update()
}
btn_fpf.onclick=function(){
  chara().fp=chara().fpmax
  update()
}
btn_save.onclick=function(){
  localStorage.tcdg = LZString.compress(JSON.stringify(dotrack))
  btn_load.disabled =false
  btn_load.textContent = "Load"
}
btn_one.onclick=function(){
  chara().ap -= 1
  update();
}
btn_two.onclick=function(){
  chara().ap -= 2
  update();
}

btn_load.onclick=function(){
  load(localStorage.tcdg,1)
}

function load(loadsource,type){ //type 1 is normal, type 2 URICompnent (UTF-8)
    var list = getId('sl_namelist') 
    var fdata = ""
    try{
    switch(type){
      case 1:
      fdata = JSON.parse(LZString.decompress(loadsource))
      break;
      case 2:
      fdata = JSON.parse(LZString.decompressFromEncodedURIComponent(loadsource))
      break
    }
    var btns = document.getElementsByTagName('button');
    init = true
  fdata.names.forEach(function(item){
    var option = document.createElement('option')
    option.textContent=item
    option.value = item
    list.add(option);
  }
    )
  dotrack = fdata
  for (var i = btns.length - 1; i >= 0; i--) {
    btns[i].disabled=false
  };
  setupAnS(); //populate the weapon add list damage type
  updateskilllist();
  supportcheck();
  updatenamelist();
  calc();
  encumber();
  display();
  cvsdisplay();
  rn_mov.disabled=false
  movdo();
  in_enc.value = chara().enc
  btn_fload.textContent = "Load From File";
  initskill();
  weapondisplay();
  skilldisplay();
}
catch(err){
  switch(type){
      case 1:
      btn_load.textContent="Failed!"
      btn_load.disabled = true
      break;
      case 2:
      btn_fload.textContent = "File Corrupt"
      break
    }  
}
}

function update(){
  chara().fp = Math.min(chara().fp,chara().fpmax);
  chara().fp = Math.max(chara().fp,-chara().fpmax);
  chara().ap = Math.min(chara().ap,chara().apmax);
  chara().ap = Math.max(chara().ap,0);
  if(chara().fp == chara().fpmax){
    chara().fprec = chara().fpmax;
  }
  chara().enc = in_enc.valueAsNumber
  getId('rn_mov').min = 1
  getId('rn_mov').max = chara().mov
  encumber();
  calc();
  display();
  cvsdisplay();
}

//functions

function diceadds(dice,modi){ //Thanks to Aion#4968 on the GURPS discord for help.
  var fdi = dice + (Math.floor(modi / 7) *2) + Math.floor((modi % 7) / 4) //final dice
  var fmodi = Math.floor(modi % 7 % 4) //final modifier
  return [fdi,fmodi]
}

function round(_n){
  var r = Math.floor(_n);
  var res =0
  if(r>=0.5){
    res = Math.ceil(_n)
  }else{res=Math.floor(_n)}
  return res
}

function basiclift(_st){
    var bl = (_st * _st)/5
    if(bl>10){
      bl = round(bl)
    }else{bl = Math.floor(bl *10)/10}
    return bl
}

function encumber(){
  var _enc = Math.ceil(parseInt(in_enc.value)/basiclift(chara().st))
  if (_enc >6){_enc = 10}else if(_enc > 3){_enc = 6;} //rounding encumberance
  switch(_enc){
    case 0:
    chara().mov = Math.floor(((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)
      chara().dodgepen =0
    break;
    case 1:
      chara().mov = Math.floor(((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)
      chara().dodgepen =0
    break;
    case 2:
      chara().mov = Math.floor((((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)*0.8)
      chara().dodgepen =-1
     break;
     case 3:
      chara().mov = Math.floor((((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)*0.6)
      console.log(chara().mov)
      chara().dodgepen =-2
    break;
    case 6:
      chara().mov = Math.floor((((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)*0.4)
      chara().dodgepen =-3
    break;
    case 10:
      chara().mov = Math.floor((((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)*0.2)
      chara().dodgepen =-4
    break;
    default:
    console.log("an error in encumberance occured, value= "+_enc)
    
  }
  chara().mov = Math.max(chara().mov,1)  
}

//display
function display(){
  getId("txt_name").textContent = chara().name
  getId("txt_AP").textContent = chara().ap +"/"+ chara().apmax + " AP"
  getId("txt_FP").textContent = chara().fp +"/"+ chara().fpmax + " FP"
  getId("txt_st").textContent = round(chara().st*10)/10 +"/"+ chara().stmax + " ST"
  getId("txt_dx").textContent = chara().dx +"/"+ chara().dxmax + " DX"
  var pentext = -Math.floor((chara().fpmax -chara().fp)/chara().fpmax/2*10) + " to most skills.";
  if(cb_highres.checked){
    pentext = `IQ skills: ${chara().iq - chara().iqmax} DX skills: ${chara().dx - chara().dxmax}`
  }
  getId("txt_pen").textContent = pentext
  getId("txt_iq").textContent = chara().iq +"/"+ chara().iqmax + " IQ"
  getId("txt_ht").textContent = chara().ht +"/"+ chara().htmax + " HT"
  getId("txt_will").textContent = chara().per +"/"+ chara().willmax + " Will"
  getId("txt_per").textContent = chara().per +"/"+ chara().permax + " Perception"
  getId("txt_lif").innerHTML = basiclift(chara().st) +"/"+ basiclift(chara().st) + "lbs <b>BL</b>"
  getId("txt_enc").textContent = "Encumberance Dodge penalty: "+ chara().dodgepen
  getId("txt_mov").textContent =`Move: ${chara().mov} || Dodge: ${Math.floor(((chara().ht + chara().dx)/4)+3 + parseInt(in_dod.value))} || ${chara().notes} `
  getId("txt_status").innerHTML = status
  getId("txt_dmg").textContent = `thr: ${dmgtbl.thrust[Math.floor(chara().st)]} sw: ${dmgtbl.swing[Math.floor(chara().st)]}`
  skilldisplay()
}
//calc

function calc(){
  chara().fp = Math.max(chara().fp, -chara().fpmax); //floor of fp loss
  chara().st = chara().stmax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2)
  //fp recovery for showing where someone's actually at in recovery.
  chara().fprec = Math.min(chara().fprec,chara().fp)
  //
  var penalty = Math.floor((chara().fpmax -chara().fp)/chara().fpmax/2*10);

  if(cb_cap.checked){
    penalty = Math.min(penalty,5)
    chara().st = Math.max(chara().st = chara().stmax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2),chara().stmax/2)
  }

  
  
  if(cb_highres.checked && !cb_cap.checked){
    chara().iq = Math.ceil(chara().iqmax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2));
    chara().dx = Math.ceil(chara().dxmax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2));
    chara().ht = Math.ceil(chara().htmax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2));
    chara().will = Math.ceil(chara().willmax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2));
    chara().per = Math.ceil(chara().permax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2));
  }else if(cb_highres.checked && cb_cap.checked){
    chara().iq = Math.ceil(chara().iqmax * Math.max((1 - (chara().fpmax -chara().fp)/chara().fpmax/2),0.5));
    chara().ht = Math.ceil(chara().htmax * Math.max((1 - (chara().fpmax -chara().fp)/chara().fpmax/2),0.5));
    chara().dx = Math.ceil(chara().dxmax * Math.max((1 - (chara().fpmax -chara().fp)/chara().fpmax/2),0.5));
    chara().will = Math.ceil(chara().willmax * Math.max((1 - (chara().fpmax -chara().fp)/chara().fpmax/2),0.5));
    chara().per = Math.ceil(chara().permax * Math.max((1 - (chara().fpmax -chara().fp)/chara().fpmax/2),0.5));
  }else{
    chara().iq = chara().iqmax -  penalty;
    chara().dx = chara().dxmax - penalty;
    chara().ht = chara().htmax - penalty;
    chara().per = chara().permax - penalty;
    chara().will = chara().willmax - penalty;

  };
  if((chara().fp/(chara().fppoint)>=1)){
    status = "<b>Mild Fatigue</b></br>"
  }else if (chara().fp/(chara().fppoint)<1 && chara().fp/(chara().fppoint)>=0){
    status = "<b style=\"color:red;\">Severe Fatigue</b></br>"
  }else if((chara().fp/chara().fppoint)< 0 ){
    status = "<b style=\"font-family=impact;color:Purple\">DEEP Fatigue</b>" + "</br>Lose HP for each FP spent."
  }
  if(chara().fp <= -chara().fpmax){status= "<b style=\"font-family=impact;color:Purple\">UNCONCIOUS! DEEP Fatigue</br>Hours Per FP recovered: </b>" +  Math.floor(((240/chara().fpmax)*chara().fittime)*100)/100
  }
  //calculate skill level
  for (var i = 0; i < chara().skills.length; i++) {
    var max =   chara()[chara().skills[i].base.toLowerCase()+"max"] + chara().skills[i].RSL
    chara().skills[i].sl = max + (chara()[chara().skills[i].base.toLowerCase()] - chara()[chara().skills[i].base.toLowerCase()+"max"])
  };
}

////////////////SKILL ZONE GIT GUD/////////////

function setupAnS(){
    repopulatelist('sl_nwd',["thr","sw","dmg"]) //populate the weapon add list damage type
    repopulatelist('sl_nwdt',["pi-","burn","cor","cr","fat","pi","tox","cut","pi+","imp","pi++"])
    sl_nwdt.selectedIndex = 3
}


////////
function initskill(){
  for (var i = sl_namelist.length - 1; i >= 0; i--) {
    if(typeof dotrack[sl_namelist[i].value].skills === 'undefined'){
      dotrack[sl_namelist[i].value].skills = []
    }
  };
}

function updateskilllist(){
  //At least this only gets called once or twice.
  repopulatelist('sl_nsba',["ST","DX","IQ","HT","WILL","PER"])
  sl_nsba.selectedIndex=1
}

function newskill(){
  chara().skills.push({
    "name":ti_nsname.value,
    "base":sl_nsba.value,
    "RSL":ti_nsnum.valueAsNumber,
    "sl": (chara()[sl_nsba.value.toLowerCase()] + ti_nsnum.valueAsNumber)
  }
    )
  skilldisplay();
}
btn_nskill.onclick = newskill


function rollskill(e){
  var success = false
  var thisskill = chara().skills[parseInt(e.target.id.split("_")[1])]
  var sl = thisskill.sl + ti_skillbon.valueAsNumber
  r = rolldice()

  if (r <= sl){
    success=true;
    e.target.textContent = `Roll ${thisskill.name} ${sl}  RSL: ${thisskill.base}+${thisskill.RSL} Success: ${r} MoS: ${sl-r}`
    e.target.style.borderColor = 'green'
  }else{
    e.target.textContent = `Roll ${thisskill.name} ${sl}  RSL: ${thisskill.base}+${thisskill.RSL} Failure: ${r} MoF: ${r-sl}`
    e.target.style.borderColor = 'red'
  }

  
}

function skilldisplay(){
  var h  = getId('skillholder')
  while(h.lastChild){
    h.removeChild(h.lastChild);
  }
  while(sl_removeskill.lastChild){
    sl_removeskill.removeChild(sl_removeskill.lastChild);
  }
  for (var i = 0; i < chara().skills.length; i++) {
    var nb = document.createElement("button")
    //nb.className
    nb.className = "skillbar"
    nb.id=`skill_${[i]}`
    nb.textContent=`Roll ${chara().skills[i].name} ${chara().skills[i].sl}  RSL: ${chara().skills[i].base}+${chara().skills[i].RSL}`
    nb.onclick = rollskill
    h.appendChild(nb)
    ///addd to removal list
    var option = document.createElement('option')
    option.textContent=chara().skills[i].name
    option.value = i
    sl_removeskill.add(option);
  };
}

function removeskill(){
  if(sl_removeskill.value){
    chara().skills.splice(parseInt(sl_removeskill.value),1)
  }
  skilldisplay()
}


btn_removeskill.onclick = removeskill

/////////////ZONE END - WEAPON ZONE BEGIN//////////

function newweapon(){
  chara().weapons.push({
    "name":ti_nwname.value,
    "base":sl_nwd.value,
    "dice":ti_nwdice.valueAsNumber,
    "mod":ti_nwmod.valueAsNumber,
    "type":sl_nwdt.value
  }
    )
  weapondisplay();
}
btn_nweapon.onclick =newweapon

function weapondisplay(){
  var h  = getId('weaponholder')
  while(h.lastChild){
    h.removeChild(h.lastChild);
  }
  while(sl_removeweapon.lastChild){sl_removeweapon.removeChild(sl_removeweapon.lastChild);}
  for (var i = 0; i < chara().weapons.length; i++) {
    var nb = document.createElement("button")
    //nb.className
    nb.className = "skillbar"
    nb.id=`weapon_${[i]}`
    var dmg = getweapondamage(i)
    var addstxt = dmg[1]
    if(dmg[1]>=0){
      addstxt = `+${dmg[1]}`
    }
    nb.textContent=`Roll ${chara().weapons[i].name}\nDamage: ${dmg[0]}d${addstxt} ${chara().weapons[i].type} Roll: --`
    nb.onclick = rollweapon
    h.appendChild(nb)
    ///addd to removal list
    var option = document.createElement('option')
    option.textContent=chara().weapons[i].name
    option.value = i
    sl_removeweapon.add(option);
  };
}

function removeweapon(){
  if(sl_removeweapon.value){
    chara().weapons.splice(parseInt(sl_removeweapon.value),1)
  }
  weapondisplay()
}
btn_removeweapon.onclick = removeweapon

function rollweapon(e){
  var w = parseInt(e.target.id.split("_")[1])
  var weapondmg = getweapondamage(w);

  var array = new Uint8ClampedArray(weapondmg[0]);
  window.crypto.getRandomValues(array);
  var r = 0
  for (var i = 0; i < array.length; i++) {
    r += Math.ceil(array[i]/255 *6)
  }
  r+=weapondmg[1]
  var addstxt = ""
  if(weapondmg[1]>=0){
    addstxt = `+${weapondmg[1]}`
  }
  e.target.textContent=`Roll ${chara().weapons[w].name}\nDamage: ${weapondmg[0]}d${addstxt} ${chara().weapons[w].type} Roll: ${r}`
}

cb_dmgbon.onchange = weapondisplay
ti_dmgbon.onchange = weapondisplay

function getweapondamage(x){
  var thisweapon = chara().weapons[x]
  var dice = 0
  var adds  = 0
  var ds = ""
  switch(thisweapon.base){ // bases  ["thr","sw","other"]
    case "thr":
    ds = dmgtbl.thrust[Math.floor(chara().st)].split("d")
    dice = parseInt(ds[0])
    adds = parseInt(ds[1])
    break;
    case "sw":
    ds = dmgtbl.swing[Math.floor(chara().st)].split("d")
    dice = parseInt(ds[0])
    adds = parseInt(ds[1])
    break;

    default:
    dice = 0
    adds  = 0
    break;
  }
  dice += thisweapon.dice
  adds += thisweapon.mod
  if(cb_dmgbon.checked){
    adds += (dice * ti_dmgbon.valueAsNumber)
  }else{
    adds += ti_dmgbon.valueAsNumber
  }

  if(cb_diceadds.checked){
    var arr = diceadds(dice,adds)
    dice = arr[0]
    adds = arr[1]
  }
  return [dice,adds]
}
cb_diceadds.onclick=function(){
  weapondisplay()
}

//////////////////Main Code Ends Here//////////////
function repopulatelist(list,arr){
  var list = getId(list)
  while(list.lastChild){
    var x = list.removeChild(list.lastChild);
    x = null
  }
  arr.forEach(function(item){
    var option = document.createElement('option')
    option.textContent=item
    option.value = item
    list.add(option);
  }
    )
}

///fun stuff
document.onclick=function(){
  if(!cb_tcd.checked){


	function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
	}
	var helements = document.querySelectorAll(".he")
	for (var i = 0; i < helements.length; i++) {
    helements[i].style.color = getRandomColor()
}

}}