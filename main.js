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
    //display the proper sidebar, but first hide the others
    var displays = document.getElementsByName('displays')
    for (var i = displays.length - 1; i >= 0; i--) {
      displays[i].style.display='none'
    };
    
    getId(`${tabName}_display`).style.display='block'
    /*
    if(typeof window[`fun_${tabName}`] === 'function'){
      window[`fun_${tabName}`]()
    }
    */

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
var cvs = getId("lastgasp_display")
var ctx = cvs.getContext("2d");
//canvas
function cvssetup(_fp){
  var fontscale = getId("lastgasp_display").height/875
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle="#000000"
  ctx.font= `${round(Math.max(32*fontscale,8))}px Arial`;
  ctx.fillText("FP",30,32)
  ctx.font= `${round(Math.max(18*fontscale,8))}px Arial`;
  ctx.translate(0,72 * Math.max(getId("lastgasp_display").height/875),0.5)
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
  getId("lastgasp_display").style.height = Math.min(window.innerHeight,875)+"px"
  getId("lastgasp_display").height = Math.min((window.innerHeight*0.95),875)
  var fontscale = getId("lastgasp_display").height/875
  //scale code
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.translate(0,72 * Math.max(getId("lastgasp_display").height/875),0.5)
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
  if(init){
  log(`Chara changed to ${sl_namelist.value}`)}
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
  log(`added ${ti_name.value}`)
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
    dotrack[ti_name.value].fpmax=parseInt(in_FP.value);
    dotrack[ti_name.value].dxmax=parseInt(in_DX.value);
    dotrack[ti_name.value].hpmax=in_HP.valueAsNumber;
    dotrack[ti_name.value].hp= in_HP.valueAsNumber;
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
    dotrack[ti_name.value].dodgemod = in_dod.valueAsNumber
    dotrack[ti_name.value].dodgepen = 0;
    dotrack[ti_name.value].skills=[{"name":"DX", "base":"DX", 'RSL':0}];
    dotrack[ti_name.value].weapons=[{"name":"Punch",
    "base":"thr",
    "dice":0,
    "mod":-1,
    "type":"cr"}];
    dotrack[ti_name.value].hittrack = {}
    for (var i = 0; i < wdatahitloc.track.length; i++) {
      dotrack[ti_name.value].hittrack[wdatahitloc.track[i]] = {"hp":Math.ceil(dotrack[ti_name.value].hpmax/wdatahitloc[wdatahitloc.track[i]].mod),"hpmax":Math.ceil(dotrack[ti_name.value].hpmax/wdatahitloc[wdatahitloc.track[i]].mod)}
    };
    hitloc.init()
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
    //additional init
    setupwdisplay();
    wthlsInit()
    woundcolor();
    qwepSetup();
    in_hps.value=dotrack[ti_name.value].hp
    getId('txt_rnmov').textContent = getId('txt_rnmov').textContent = `${rn_mov.value} Cost: ${round((rn_mov.valueAsNumber/chara().mov)*10)} AP`
    rn_mov.disabled =false

}
//name list box


//ui callbacks
function movdo(){
  getId('rn_mov').min = 1
  getId('rn_mov').max = Math.floor(chara().mov)
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
  hitloc.init()
  setupAnS(); //populate the weapon add list damage type
  updateskilllist();
  supportcheck();
  updatenamelist();
  calc();
  encumber();
  cvsdisplay();
  rn_mov.disabled=false
  movdo();
  defaultwp();;
  in_enc.value = chara().enc
  btn_fload.textContent = "Load From File";
  initskill();
  setupwdisplay();
  weapondisplay();
  //additional init
  wthlsInit()
  woundcolor();
  skilldisplay();
  qwepSetup();
  display();
  in_hps.value=chara().hp
  for (var i = 0; i < wdatahitloc.track.length; i++) {
    var part = wdatahitloc.track[i]
    if(wdatahitloc.display[part]==2){
    manhitsvg.getElementById(part).style.fill =gradtwoGet(getHPpercentPart(part))
    }else{
     manhitsvg.getElementById(part).style.fill =gradthreeGet(getHPpercentPart(part))
    }

  };
  
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
function defaultwp(){
  if(typeof chara().skills[0] ==='undefined'){
  chara().skills.push({"name":"DX", "base":"DX", 'RSL':0})
  };
  if(typeof chara().weapons[0] ==='undefined'){
    chara.weapons.push({"name":"Punch",
    "base":"thr",
    "dice":0,
    "mod":-1,
    "type":"cr"});
  }
} //default weapon and skills


function update(){
  chara().fp = Math.min(chara().fp,chara().fpmax);
  chara().fp = Math.max(chara().fp,-chara().fpmax);
  chara().ap = Math.min(chara().ap,chara().apmax);
  chara().ap = Math.max(chara().ap,0);
  if(chara().fp == chara().fpmax){
    chara().fprec = chara().fpmax;
  }
  getId('rn_mov').min = 1
  getId('rn_mov').max = chara().mov
  encumber();
  calc();
  display();
  cvsdisplay();
}

//functions

function diceadds(dice,modi){ //Thanks to Aion#4968 on the GURPS discord for help.
  var fdi = 0
  var fmodi = 0
  if(modi >= 0){
  fdi = dice + (Math.floor(modi / 7) *2) + Math.floor((modi % 7) / 4) //final dice
  fmodi = Math.floor(modi % 7 % 4) //final modifier
  }else{//negative values  need to be handled with negative multipliers.
    fdi = dice + (Math.floor(modi / -7) *2) + Math.floor((modi % -7) / -4)
    fmodi = Math.floor(modi % -7 % -4) //final modifier
  }
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
  //torso penalties
  var movpen =1
  if(chara().hittrack['torso'].hp < chara().hpmax*0.5){
    movpen =0.8
  }
  if(chara().hittrack['torso'].hp < chara().hpmax*(1/3)){
    movpen =0.5
  }
  var _enc = Math.ceil(chara().enc/basiclift(chara().st))
  if(isNaN(_enc)){_enc=0}
  if (_enc >6){_enc = 10}else if(_enc > 3){_enc = 6;} //rounding encumberance
  switch(_enc){
    case 0:
    chara().mov = Math.floor(((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)*movpen
      chara().dodgepen =0
    break;
    case 1:
      chara().mov = Math.floor(((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)*movpen
      chara().dodgepen =0
    break;
    case 2:
      chara().mov = Math.floor((((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)*0.8*movpen)
      chara().dodgepen =-1
     break;
     case 3:
      chara().mov = Math.floor((((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)*0.6*movpen)
      console.log(chara().mov)
      chara().dodgepen =-2
    break;
    case 6:
      chara().mov = Math.floor((((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)*0.4*movpen)
      chara().dodgepen =-3
    break;
    case 10:
      chara().mov = Math.floor((((parseInt(chara().dx)+parseInt(chara().ht))/4)+chara().movmod)*0.2*movpen)
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
  getId("txt_mov").textContent =`Move: ${chara().mov}, Spd: ${chara().spd} || Dodge: ${Math.floor(chara().spd)+3 + chara().dodgemod} || ${chara().notes} `
  getId("txt_status").innerHTML = status
  getId("txt_dmg").textContent = `thr: ${dmgtbl.thrust[Math.floor(chara().st)]} sw: ${dmgtbl.swing[Math.floor(chara().st)]}`
  skilldisplay();
  weapondisplay();
  getId('btn_dodge').textContent =  `Roll Dodge (${Math.floor(chara().spd)+3 + chara().dodgemod + ti_dodgebon.valueAsNumber + chara().dodgepen})`
  getId('txt_hp').textContent = `${chara().hp}/${chara().hpmax} HP`;
  woundcolor();
  getId('txt_wtpen').textContent = `Bleeding Roll Base Penalty: ${Math.ceil((chara().hp-chara().hpmax)/5)}`
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
  var dxpen = 0
  //torso injury penalties
  if(chara().hittrack['torso'].hp < chara().hpmax *(2/3)){
    dxpen = -1
  }
  if(chara().hittrack['torso'].hp < chara().hpmax*0.5){
    dxpen = -2
  }
  if(chara().hittrack['torso'].hp < chara().hpmax*(1/3)){
    dxpen = -3
  }
  
  if(cb_highres.checked && !cb_cap.checked){
    chara().iq = Math.ceil(chara().iqmax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2));
    chara().dx = Math.ceil(chara().dxmax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2)+dxpen);
    chara().ht = Math.ceil(chara().htmax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2));
    chara().will = Math.ceil(chara().willmax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2));
    chara().per = Math.ceil(chara().permax * (1 - (chara().fpmax -chara().fp)/chara().fpmax/2));
  }else if(cb_highres.checked && cb_cap.checked){
    chara().iq = Math.ceil(chara().iqmax * Math.max((1 - (chara().fpmax -chara().fp)/chara().fpmax/2),0.5));
    chara().ht = Math.ceil(chara().htmax * Math.max((1 - (chara().fpmax -chara().fp)/chara().fpmax/2),0.5));
    chara().dx = Math.ceil(chara().dxmax * Math.max((1 - (chara().fpmax -chara().fp)/chara().fpmax/2),0.5)+dxpen);
    chara().will = Math.ceil(chara().willmax * Math.max((1 - (chara().fpmax -chara().fp)/chara().fpmax/2),0.5));
    chara().per = Math.ceil(chara().permax * Math.max((1 - (chara().fpmax -chara().fp)/chara().fpmax/2),0.5));
  }else{
    chara().iq = chara().iqmax -  penalty;
    chara().dx = chara().dxmax - penalty +dxpen;
    chara().ht = chara().htmax - penalty;
    chara().per = chara().permax - penalty;
    chara().will = chara().willmax - penalty;

  };
  chara().spd = ((chara().dx + chara().ht)/4) +chara().spdmod
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
  chara().hp = Math.min(chara().hp,chara().hpmax)
}
////encumberance calc////
function encumberupdate(e){
  chara().enc = e.target.valueAsNumber
  in_enc.value = chara().enc
  in_encs.value = chara().enc
  in_encw.value = chara().enc

}
in_enc.onchange = encumberupdate
in_encs.onchange = encumberupdate
in_encw.onchange = encumberupdate



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
ti_skillbon.onchange = function(e){
  numFieldcheck(e)
  skilldisplay()
  atkcalcbonus()
}

function rollskill(e){
  var success = false
  var thisskill = chara().skills[parseInt(e.target.id.split("_")[1])]
  var sl = thisskill.sl + ti_skillbon.valueAsNumber
  r = rolldice()
  text = ""
  if (r <= sl){
    success=true;
    e.target.textContent = `Roll ${thisskill.name} ${sl}  RSL: ${thisskill.base}+${thisskill.RSL} Success: ${r} MoS: ${sl-r}`
    e.target.style.borderColor = 'green'
  }else{
    e.target.textContent = `Roll ${thisskill.name} ${sl}  RSL: ${thisskill.base}+${thisskill.RSL} Failure: ${r} MoF: ${r-sl}`
    e.target.style.borderColor = 'red'
  }
  log(`Rolled ${thisskill.name} ${success.toString()} MoS: ${sl-r} B: ${ti_skillbon.value}`)
  
}

function skilldisplay(){
  var h  = getId('skillholder')
  defaultwp()
  while(h.lastChild){
    h.removeChild(h.lastChild);
  }
  while(sl_removeskill.lastChild){
    sl_removeskill.removeChild(sl_removeskill.lastChild);
  }
  while(sl_atkskill.lastChild){
    sl_atkskill.removeChild(sl_atkskill.lastChild);
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
    var option = document.createElement('option')
    option.textContent=chara().skills[i].name
    option.value = i
    sl_atkskill.add(option);
  };
  sl_removeskill.removeChild(sl_removeskill.firstChild)
}

function removeskill(){
  if(sl_removeskill.value){
    chara().skills.splice(parseInt(sl_removeskill.value),1)
  }
  skilldisplay()
}


btn_removeskill.onclick = removeskill

/////////////ZONE END - WEAPON ZONE BEGIN//////////

function attackcalcdisplay(){
  txt_atkskill.textContent=1
}


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
  defaultwp()
  while(h.lastChild){
    h.removeChild(h.lastChild);
  }
  while(getId('sl_atkweapon').lastChild){
    getId('sl_atkweapon').removeChild(getId('sl_atkweapon').lastChild);
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
    var option = document.createElement('option')
    option.textContent=chara().weapons[i].name
    option.value = i
    sl_atkweapon.add(option)
  };
  sl_removeweapon.removeChild(sl_removeweapon.firstChild)
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
  }else{
    addstxt=weapondmg[1]
  }
  e.target.textContent=`Roll ${chara().weapons[w].name}\nDamage: ${weapondmg[0]}d${addstxt} ${chara().weapons[w].type} Roll: ${Math.max(r,1)}`
  log(`Rolled Weapon ${w.name}, B: ${ti_dmgbon.value} Dmg: ${Math.max(r,1)}`)
}

cb_dmgbon.onchange = function(e){
  if(init){
  weapondisplay()
  atkcalcbonus()}
}
ti_dmgbon.onchange = function(e){
  if(init){
  numFieldcheck(e)
  weapondisplay()
  atkcalcbonus()
}
}

function getweapondamage(x){
  var thisweapon = x
  if(typeof x === 'number'){
  thisweapon = chara().weapons[x]
  }
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
//////////wound and wound svg stuff////////
hitloc = {}
hitloc.selected=""
hitloc.init =function(){
  manhitsvg = document.getElementById("man-svg").contentDocument
  for (var i = 0; i < manhitsvg.getElementById('mainhitloc').childNodes.length; i++) {
      if(manhitsvg.getElementById('mainhitloc').childNodes[i].style){
      manhitsvg.getElementById('mainhitloc').childNodes[i].onclick=hitloc.onSelect
      manhitsvg.getElementById('mainhitloc').childNodes[i].style['stroke-opacity']='0.1'
      manhitsvg.getElementById('mainhitloc').childNodes[i].style['stroke-width']='1'
    }
  };

}
hitloc.getpart = function(id){
  return manhitsvg.getElementById(id)
}
ti_dodgebon.onchange = function(){
  display()
}

btn_dodge.onclick = function(e){
  var roll = rolldice()
  if(roll <= Math.floor(chara().spd)+3 + chara().dodgemod + ti_dodgebon.valueAsNumber + chara().dodgepen){
    txt_dodgeroll.textContent = `Success! ${roll}, MoS: ${(Math.floor(chara().spd)+3 + chara().dodgemod + ti_dodgebon.valueAsNumber + chara().dodgepen) - roll}`
    txt_dodgeroll.className = 'fine'
  }else{
    txt_dodgeroll.textContent = `Failure! ${roll}, MoF: ${roll - (Math.floor(chara().spd)+3 + chara().dodgemod + ti_dodgebon.valueAsNumber + chara().dodgepen)}`
    txt_dodgeroll.className = 'cripple'
  }
}


function woundcolor(){
  var torpercent = Math.floor(((chara().hpmax*5) + chara().hp) / ((chara().hpmax*5)+ chara().hpmax)*100)/100
   manhitsvg.getElementById('base').style['stroke-width'] = 10 * (1.1-torpercent)

    manhitsvg.getElementById('base').style.stroke = gradGet(torpercent)
  

}
btn_hpp.onclick = function(){
  chara().hp+=1
  calc()
  display();
}
btn_hpm.onclick = function(){
  chara().hp-=1
  calc()
  display();
}


function setupwdisplay(){
  var area = getId("wtarea")
  while(area.lastChild){
    var x = area.removeChild(area.lastChild);
    x = null
  }
  for (var i = 0; i < wdatahitloc.track.length; i++) {
    var cont = document.createElement('span') 
    var txt  = document.createElement('span') 
    txt.textContent = `${wdatahitloc[wdatahitloc.track[i]].name} `;
    cont.id = `p_${wdatahitloc.track[i]}`
    cont.className='fine'
    txt.className='textblock'
    txt.style.width ='90px'
    cont.appendChild(txt)
    var put = document.createElement("input");
    put.type = "number";
    put.id = `in_${wdatahitloc.track[i]}`;
    put.value = chara().hittrack[wdatahitloc.track[i]].hp;
    put.onchange=wtrackupdate
    cont.appendChild(put);
    var divider = document.createElement('span');
    divider.textContent =  `/${chara().hittrack[wdatahitloc.track[i]].hpmax} HP `;
    var dis = document.createElement('b');
    dis.id =`txt_${wdatahitloc.track[i]}`;
    cont.appendChild(divider)
    cont.appendChild(dis)

    cont.appendChild(document.createElement('br'))
    area.appendChild(cont)
  };
}
function wtrackupdate(e){
  var part = e.target.id.split("_")[1]
  chara().hittrack[part].hp = e.target.valueAsNumber

  chara().hittrack[part].hp = Math.min(chara().hittrack[part].hp,chara().hittrack[part].hpmax)
  e.target.value = chara().hittrack[part].hp
  if(chara().hittrack[part].hp <= -(chara().hittrack[part].hpmax+1) * 2){
  getId(`txt_${part}`).textContent = `DESTROYED/DISMEMBERED`
  getId(`p_${part}`).className = 'destroy'
  }else if(chara().hittrack[part].hp <0){
    getId(`txt_${part}`).textContent = `CRIPPLED`
    getId(`p_${part}`).className = 'cripple'
  }else{
    getId(`txt_${part}`).textContent = ""
    getId(`p_${part}`).className = 'fine'
  }
  e.target.value = chara().hittrack[part].hp
  if(wdatahitloc.display[part]==2){
    manhitsvg.getElementById(part).style.fill =gradtwoGet(getHPpercentPart(part))
  }else{
    manhitsvg.getElementById(part).style.fill =gradthreeGet(getHPpercentPart(part))
  }
  encumber();
  display();
}

function getHPpercentPart(part_){
  return Math.floor((((chara().hittrack[part_].hpmax+1)*2) + chara().hittrack[part_].hp) / (((chara().hittrack[part_].hpmax +1)*2)+ chara().hittrack[part_].hpmax)*100)/100
}
in_hps.onchange = function(){
  chara().hp = Math.min(chara().hpmax, in_hps.valueAsNumber)
  in_hps.value= chara().hp
  display();
}

hitloc.onSelect = function(e){
  hitloc.selected=e.target.id
  for (var i = 0; i < manhitsvg.getElementById('mainhitloc').childNodes.length; i++) {
    if(manhitsvg.getElementById('mainhitloc').childNodes[i].style){
      manhitsvg.getElementById('mainhitloc').childNodes[i].style.stroke='#000000';
      manhitsvg.getElementById('mainhitloc').childNodes[i].style['stroke-opacity']='0.1'
      manhitsvg.getElementById('mainhitloc').childNodes[i].style['stroke-width']='1'
    }
  };
  e.target.style.stroke = '#FFFF66'
  e.target.style['stroke-width']=2
  e.target.style['stroke-opacity'] = '1'
  //display in the wounds_display
  var distext = `<h4>${wdatahitloc[e.target.id].name}</h4><h5>Hit Penalty ${wdatahitloc[e.target.id].penalty}</h5>`
  var tags = wdatahitloc[e.target.id].tags.split(",")
  for (var i = 0; i < tags.length; i++) {
    distext = distext.concat(`<p>${wdatatags[tags[i]]}</p>`)
  };
  getId('wounds_display').innerHTML= distext
}

hitloc.displaypart = function(id){
  if (manhitsvg.getElementById(id).style.display=="none") {
    manhitsvg.getElementById(id).style.display = "inline"
  }else{
    manhitsvg.getElementById(id).style.display = "none"
  };
}
hitloc.colour = function(id,colour){
  if(typeof colour === 'undefined'){; return manhitsvg.getElementById(id).style.fill}
    else{
      return manhitsvg.getElementById(id).style.fill = colour
    }
}



//////////attack calculator//////////

hitselect="torso"

getId('rb_atk-melee').checked=true
function radioVisSwitch(e){
  var t = getId(e.target.id.split("_")[1])

  var a = document.getElementsByName(e.target.name)
  for (var i = a.length - 1; i >= 0; i--) {
    getId(a[i].id.split("_")[1]).style.display='none'
  };
  if(e.target.checked){
    t.style.display="block"
  }
}
getId("rb_atk-melee").onchange = function(e){
  radioVisSwitch(e)
  atkcalcbonus()
}
getId("rb_atk-ranged").onchange = function(e){
  radioVisSwitch(e)
  atkcalcbonus()
}

function atkcalcbonus(){
  var bonus = ti_skillbon.valueAsNumber
  var manu = "atk"
  var weapon = chara().weapons[parseInt(sl_atkweapon.value)]
  var base =""
  switch(weapon.base){
    case "thr":
    base='thrust'
    break;
    case "sw":
    base="swing"
    break;
  }
  if(getId('rb_atk-melee').checked){
    manu=sl_meleeopt.value
  }else if(getId('rb_atk-ranged').checked){
    manu=sl_rangedopt.value
  }
  var hitpen = 0 
  var text = ""
  var locselect = "random hit location"
  if(!cb_randomhit.checked){
    hitpen = wdatahitloc[wthitselected].penalty
    locselect = wdatahitloc[wthitselected].name

  }
  switch(manu){
    case "atk":
      bonus += hitpen
      text = `Attack on enemy ${locselect} with skill ${chara().skills[parseInt(sl_atkskill.value)].sl+bonus}`
    break;
    case "com-stron":
      bonus += hitpen
      cb_dmgbon.checked =false
      text = `Committed Strong Attack on enemy ${locselect} with skill ${chara().skills[parseInt(sl_atkskill.value)].sl+bonus}.`
    break;
    case "com-deter":
      bonus +=2 + hitpen
      text= `Committed Strong Attack on enemy ${locselect} with skill ${chara().skills[parseInt(sl_atkskill.value)].sl+bonus}.`
    break;
    case "def":
      bonus +=hitpen
      text = `Defensive Attack on enemy ${locselect} with skill ${chara().skills[parseInt(sl_atkskill.value)].sl+bonus}.`
    break;
    case "aoa-stron":
      bonus +=hitpen
      text = `All Out Strong Attack on enemy ${locselect} with skill ${chara().skills[parseInt(sl_atkskill.value)].sl+bonus}.`
    break;
    case "aoa-deter":
      bonus +=hitpen +4
      text = `All Out Determined Attack on enemy ${locselect} with skill ${chara().skills[parseInt(sl_atkskill.value)].sl+bonus}.`
    break;
    case "aoa-feint":
      bonus +=hitpen
      text = `All Out Feint & Attack on enemy ${locselect} with skill ${chara().skills[parseInt(sl_atkskill.value)].sl+bonus}.`
    break;
    case "aoa-long":
      bonus +=hitpen
      text = `All Out Long Attack (Add +1 to Reach) on enemy ${locselect} with skill ${chara().skills[parseInt(sl_atkskill.value)].sl+bonus}.`
    break;
    case "aoa-doub":
      bonus +=hitpen
      text = `All Out Double Attack on enemy ${locselect} with skill ${chara().skills[parseInt(sl_atkskill.value)].sl+bonus}.`
    break;
    case "atk-r":
      bonus +=hitpen + ti_rangepen.valueAsNumber + ti_aimbon.valueAsNumber
      text = `Ranged Attack on enemy ${locselect} with skill ${chara().skills[parseInt(sl_atkskill.value)].sl+bonus}.`
    break;
    case "aoa-detr":
      bonus +=hitpen + ti_rangepen.valueAsNumber + ti_aimbon.valueAsNumber + 1
      text = `All Out Ranged Attack on enemy ${locselect} with skill ${chara().skills[parseInt(sl_atkskill.value)].sl+bonus}.`
    break;
    
  }
  getId('txt_atkcalc').textContent = text
  return [bonus,manu]
}
sl_atkweapon.onchange=atkcalcbonus
sl_atkskill.onchange=atkcalcbonus
cb_randomhit.onchange=atkcalcbonus
sl_meleeopt.onchange=atkcalcbonus
sl_rangedopt.onchange=atkcalcbonus
ti_rangepen.onchange=function(e){
  numFieldcheck(e)
  atkcalcbonus()
}
ti_aimbon.onchange=function(e){
  numFieldcheck(e)
  atkcalcbonus()
}

function numFieldcheck(e){
  if(isNaN(e.target.valueAsNumber)){
    e.target.value = "0"
  }
}

// wound tracker hit location figure
function wthlsInit(){ //wound tracker hit location selector init
  wthitsvg = document.getElementById("atk-man-svg").contentDocument
  for (var i = 0; i < wthitsvg.getElementById('mainhitloc').childNodes.length; i++) {
      if(wthitsvg.getElementById('mainhitloc').childNodes[i].style){
      wthitsvg.getElementById('mainhitloc').childNodes[i].onclick=wthls
      wthitsvg.getElementById('mainhitloc').childNodes[i].style['stroke-opacity']='0.1'
      wthitsvg.getElementById('mainhitloc').childNodes[i].style['stroke-width']='1'
    }
  };

}
wthitselected = "torso"
function wthls(e){ //wound tracker hit location select. I sure do love duplicated functionality
  wthitselected=e.target.id
  for (var i = 0; i < wthitsvg.getElementById('mainhitloc').childNodes.length; i++) {
    if(wthitsvg.getElementById('mainhitloc').childNodes[i].style){
      wthitsvg.getElementById('mainhitloc').childNodes[i].style.stroke='#000000';
      wthitsvg.getElementById('mainhitloc').childNodes[i].style['stroke-opacity']='0.1'
      wthitsvg.getElementById('mainhitloc').childNodes[i].style['stroke-width']='1'
    }
  };
  e.target.style.stroke = '#FFFF66'
  e.target.style['stroke-width']=2
  e.target.style['stroke-opacity'] = '1'
  //display in the wounds_display
  var distext = `<h4>${wdatahitloc[e.target.id].name}</h4><b>Hit Penalty ${wdatahitloc[e.target.id].penalty}</b></br>`
  var tags = wdatahitloc[e.target.id].tags.split(",")
  for (var i = 0; i < tags.length; i++) {
    distext = distext.concat(`<p>${wdatatags[tags[i]]}</p>`)
  };
  getId('txt_wthls').innerHTML= distext
  if(!cb_randomhit.checked){
    atkcalcbonus()
  }
}

function atkcalc(){
  var a = atkcalcbonus()
  var manu = a[1]
  var bonus = a[0]
  var weapon = chara().weapons[parseInt(sl_atkweapon.value)]
  var dmg = getweapondamage(parseInt(sl_atkweapon.value))// 0 is dice, 1 is modifiers
  var text = ""
  var thisskill = chara().skills[parseInt(sl_atkskill.value)]
  var sl = thisskill.sl + ti_skillbon.valueAsNumber + bonus
  var success =false
  wthitsvg.getElementById('face').style.fill = '#8ae234'
  wthitsvg.getElementById('neck').style.fill = '#8ae234'
  wthitsvg.getElementById('head').style.fill = '#8ae234'
  wthitsvg.getElementById('groin').style.fill = '#8ae234'
  for (var i = 0; i < wthitsvg.getElementById('mainhitloc').childNodes.length; i++) {
    var type = wdatahitloc.display[manhitsvg.getElementById('mainhitloc').childNodes[i].id]
    if(manhitsvg.getElementById('mainhitloc').childNodes[i].style && type == 2){
      wthitsvg.getElementById('mainhitloc').childNodes[i].style.fill = '#8ae234'
    }
    if(manhitsvg.getElementById('mainhitloc').childNodes[i].style &&  type == 3){
      wthitsvg.getElementById('mainhitloc').childNodes[i].style.fill = '#729fcf'
    }
  };
  switch(manu){
    case "atk":
    break;
    case "com-stron":
      if(parseInt(dmgtbl[base][Math.floor(chara().st)].split('d')[0])>2){//aoa strong damage bonus
        dmg[1] += Math.floor(dmg[0]/2)
      }else{
        dmg[1] += 1
      }
    break;
    case "com-deter":
    break;
    case "def":
      if(parseInt(dmgtbl[base][Math.floor(chara().st)].split('d')[0])>2){//defensive damage penalty
        dmg[1] -= dmg[0]
      }else{
        dmg[1] -= 2
      }
    break;
    case "aoa-stron":
      if(parseInt(dmgtbl[base][Math.floor(chara().st)].split('d')[0])>2){//aoa strong damage bonus
        dmg[1] += dmg[0]
      }else{
        dmg[1] += 2
      }
    break;
    case "aoa-deter":
    break;
    case "aoa-feint":
      fr = rolldice()
      if (r <= sl){
        text += `\n Roll ${r} Feint Success, MoS: MoS: ${sl-r}`
      }else if(r==sl+1 ){
        text += ""
      }else{
        text += `\n Roll ${r} Feint failed: MoF: ${r-sl}`
      }
    break;
    case "aoa-long":
    break;
    case "aoa-doub":
      r = rolldice()
      if (r <= sl){
        text += `\n Roll: ${r} Hit, MoS: MoS: ${sl-r} Damage: `
      }else if(r==sl+1 ){
        text += `\n Roll: ${r} Miss By 1, MoS: MoS: ${sl-r} Damage: `
      }else{
        text += `\n Roll: ${r} Miss: MoF: ${r-sl} Damage: `
      }
      //damage
      var array = new Uint8ClampedArray(dmg[0]);
      window.crypto.getRandomValues(array);
      var damageroll = 0
      for (var i = 0; i < array.length; i++) {
        damageroll += Math.ceil(array[i]/255 *6)
      }
      damageroll+=dmg[1]
      damageroll = Math.max(damageroll,1)
      text += damageroll.toString()
      if(cb_randomhit.checked){
        var locationhit =wdatarollloc[rolldice()]
        wthitsvg.getElementById(locationhit).style.fill= '#FF0000'
        text += ` Location: ${wdatahitloc[locationhit].name}`
      }
    break;
    case "atk-r":
    break;
    case "aoa-detr":
    break;
  }
  //skill roll part
  r = rolldice()
  if (r <= sl){
    text += `\n Roll: ${r} Hit, MoS: MoS: ${sl-r} Damage: `
  }else if(r==sl+1 ){
    text += `\n Roll: ${r} Miss By 1, MoS: MoS: ${sl-r} Damage: `
  }else{
    text += `\n Roll: ${r} Miss: MoF: ${r-sl} Damage: `
  }
  //damage
  var array = new Uint8ClampedArray(dmg[0]);
  window.crypto.getRandomValues(array);
  var damageroll = 0
  for (var i = 0; i < array.length; i++) {
    damageroll += Math.ceil(array[i]/255 *6)
  }
  damageroll+=dmg[1]
  damageroll = Math.max(damageroll,1)
  text += damageroll.toString()
  if(cb_randomhit.checked){
    var locationhit =wdatarollloc[rolldice()]
    if (locationhit== 'foot' || locationhit== 'hand') {
      
      if(rolldice()>10){
        locationhit +='-left'
      }else{
        locationhit +='-right'
      }
    };
    wthitsvg.getElementById(locationhit).style.fill= '#FF0000'
    text += ` Location: ${wdatahitloc[locationhit].name}`
  }
  getId('txt_atkcalc').textContent += text
  log(`Rolled attack: text`)
}

btn_atkcalc.onclick = atkcalc


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

function log(t){
  if(typeof dotrack.log === 'undefined'){dotrack.log =""}
  if(!mobilecheck()){
    var d = new Date()
    dotrack.log += `${d.getDate()}/${d.getMonth()+1} (UTC+ ${d.getTimezoneOffset()/-60}) ${d.getHours()}:${d.getMinutes()}: ${t} \n `
  }
}

//quick weapons
function qwepSetup(){
  for (var i = 0; i < quickweps.length; i++) {
    var option = document.createElement('option')
    option.textContent = quickweps[i][0]
    option.value = i
    getId('sl_qwep').add(option);
  };
}

function qwepAdd(e){
  var wep = quickweps[getId('sl_qwep').value]
  for (var i = 1; i < wep.length; i++) {
    chara().weapons.push(wep[i])
  };
  weapondisplay();
}
btn_qwep.onclick=qwepAdd

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

function mobilecheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};