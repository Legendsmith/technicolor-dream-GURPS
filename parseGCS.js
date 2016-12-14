function parseGCS(file){
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(file,"text/xml")
	var xname = xmlDoc.getElementsByTagName('name')[0].textContent;
  	var st = 0;
  	var dx = 0;
  	var iq = 0;
  	var ht = 0;
  	var hp = 0;
  	var fp = 0;
  	var will = 0;
  	var per = 0;
  	var speed = 0;
  	var move = 0;
  	var dodge = 0;
  	//fitness
  	var fitbon =0;
  	var fittime =1;
  	var notes = "";
  	//strength
  	st = parseInt(xmlDoc.getElementsByTagName('ST')[0].textContent);
  	dx = parseInt(xmlDoc.getElementsByTagName('DX')[0].textContent);
  	iq = parseInt(xmlDoc.getElementsByTagName('IQ')[0].textContent);
  	ht = parseInt(xmlDoc.getElementsByTagName('HT')[0].textContent);
  	will = iq +parseInt(xmlDoc.getElementsByTagName('will')[0].textContent);
  	per = iq +parseInt(xmlDoc.getElementsByTagName('perception')[0].textContent);
  	var speed = (dx+ht/4) + parseInt(xmlDoc.getElementsByTagName('speed')[0].textContent);
  	var move = Math.floor(speed) + parseInt(xmlDoc.getElementsByTagName('move')[0].textContent);
  	var dodge = Math.floor(speed) +3
  	var advantages = xmlDoc.getElementsByTagName('advantage');
  	//advantages
  	for (var i = 0; i < advantages.length; i++) {
  		var checkfit = advantages[i].childNodes[1].textContent
  		console.log(checkfit)
  		switch(checkfit){//check for fitness
  			case "Fit":
  			fitbon = 1
  			fittime = 0.5
  			notes = "Fit"
  			break;
  			case "V. Fit":
  			fitbon = 2
  			fittime = 0.5
  			notes = "Fit"
  			break;
  			case "Unfit":
  			fitbon = -1
  			fittime = 2
  			notes = "Unfit"
  			break;
  			case "Very Unfit":
  			fitbon = -2
  			fittime = 2
  			notes = "V. Unfit"
  			break;
  		}
  		var attrb = advantages[i].getElementsByTagName('attribute_bonus')
  		var attrhaslevels = false
  		var attrlvl = 1
  		if(advantages[i].getElementsByTagName('levels').length >0){
  			attrlvl = parseInt(advantages[i].getElementsByTagName('levels')[0].textContent)
  		}
  		for (var i = 0; i < attrb.length; i++) {
  			var atrr =  attrb[i].getElementsByTagName('attribute')[0].textContent
  			var multiplier  =1
  			if(attrb[i].getElementsByTagName('amount')[0].id='per_level'){
  					multiplier = attrlvl
  			}
  			switch(atrr){
  				case "st":
  				st+=parseInt(attrb[i].getElementsByTagName('amount')[0].textContent)*multiplier
  				break;
  				case "dx":
  				dx+=parseInt(attrb[i].getElementsByTagName('amount')[0].textContent)*multiplier
  				break;
  				case "iq":
  				iq +=parseInt(attrb[i].getElementsByTagName('amount')[0].textContent)*multiplier
  				break;
  				case "ht":
  				ht += parseInt(attrb[i].getElementsByTagName('amount')[0].textContent)*multiplier
  				break;
  				case "will":
  				st+=parseInt(attrb[i].getElementsByTagName('amount')[0].textContent)*multiplier
  				break;
  				case "perception":
  				st+=parseInt(attrb[i].getElementsByTagName('amount')[0].textContent)*multiplier
  				break;
  				case "fp":
  				fp+=parseInt(attrb[i].getElementsByTagName('amount')[0].textContent)*multiplier
  				break;
  				case "hp":
  				hp+=parseInt(attrb[i].getElementsByTagName('amount')[0].textContent)*multiplier
  				break;
  				case "move":
  				move+=parseInt(attrb[i].getElementsByTagName('amount')[0].textContent)*multiplier
  				break;
  				case "speed":
  				speed+=parseInt(attrb[i].getElementsByTagName('amount')[0].textContent)*multiplier
  				break;
  				case "dodge":
  				dodge+=parseInt(attrb[i].getElementsByTagName('amount')[0].textContent)*multiplier
  				break;
  				default:
  				//
  				break;

  			}
  		};
  		//end attribute bonus processing
  	};//end advantage processing
  	
  	var skills = xmlDoc.getElementsByTagName('skills')

  	return {st,dx,iq}
}

function floadgcs(){
	getId('in_fload').click()
	var fileReader = new FileReader()
	fileReader.onload = function(floadEvent){
		parseGCS(floadEvent.target.result)
  }
  getId('in_fload').onchange = function(){
    for (var i = 0; i < getId('in_fload').files.length; i++) {
      if(typeof getId('in_fload').files[i] !== 'undefined'){
      fileReader.readAsText(getId('in_fload').files[i],"US-ASCII")
      };
    };  
  }
}
btn_floadgcs.onclick = floadgcs