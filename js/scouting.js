document.addEventListener("touchstart", startTouch, false);
document.addEventListener("touchend", moveTouch, false);

// Swipe Up / Down / Left / Right
var initialX = null;
var xThreshold = 0.3;
var slide = 0

// Options
var options = {
	text: "t=9998;m=99;l=q;r=b1;s=rjs;d=0;to=0;ds=5;if=0;f=15;cf=0;in=1;alp=5;aop=5;aip=5;apu=5;atr=1;atro=0;lp=20;op=10;ip=10;rc=0;pc=0;ss=[(111,111),(111,111),(111,111),(111,111),(111,111),(111,111),(111,111)];c=1;hbc=0;ac=1;hc=0;cb=0;cs=3;nh=0;p=0;b=0;tr=1;ct=3;dr=3;comm='good shooter; shot from all over the field'",
	correctLevel: QRCode.CorrectLevel.L,
    quietZone: 15,
    quietZoneColor: '#FFFFFF'
    //logo: 'resources/PWNAGE_Logo.png'
};

// Must be filled in: e=event, m=match#, l=level(q,qf,sf,f), t=team#, r=robot(r1,r2,b1..), s=scouter
var requiredFields = ["e", "m", "l", "t", "r", "s", "as"]


function getRobot(){
	if (document.getElementById("input_r_r1").checked){
		return "r1";
	} else if(document.getElementById("input_r_r2").checked){
		return "r2";
	} else if(document.getElementById("input_r_r3").checked){
		return "r3";
	} else if(document.getElementById("input_r_b1").checked){
		return "b1";
	} else if(document.getElementById("input_r_b2").checked){
		return "b2";
	} else if(document.getElementById("input_r_b3").checked){
		return "b3";
	}	else {
		return ""
	}
}

function validateRobot() {
	if (document.getElementById("input_r_r1").checked ||
		document.getElementById("input_r_r2").checked ||
		document.getElementById("input_r_r3").checked ||
		document.getElementById("input_r_b1").checked ||
		document.getElementById("input_r_b2").checked ||
		document.getElementById("input_r_b3").checked
	) {
		return true
	} else {

		return false
	}
}

function resetRobot() {
	if (document.getElementById("input_r_r1").checked) {
		document.getElementById("input_r_r1").checked = false
	}
	if (document.getElementById("input_r_r2").checked) {
		document.getElementById("input_r_r2").checked = false
	}
	if (document.getElementById("input_r_r3").checked) {
		document.getElementById("input_r_r3").checked = false
	}
	if (document.getElementById("input_r_b1").checked) {
		document.getElementById("input_r_b1").checked = false
	}
	if (document.getElementById("input_r_b2").checked) {
		document.getElementById("input_r_b2").checked = false
	}
	if (document.getElementById("input_r_b3").checked) {
		document.getElementById("input_r_b3").checked = false
	}
}


function getLevel(){
	if(document.getElementById("input_l_qm").checked){
		return "qm";
	} else if(document.getElementById("input_l_ef").checked){
		return "ef";
	} else if(document.getElementById("input_l_qf").checked){
		return "qf";
	} else if(document.getElementById("input_l_sf").checked){
		return "sf";
	} else if(document.getElementById("input_l_f").checked){
		return "f";
	} else {
		return "";
	}
}

function validateLevel() {
	if (document.getElementById("input_l_qm").checked ||
		document.getElementById("input_l_ef").checked ||
		document.getElementById("input_l_qf").checked ||
		document.getElementById("input_l_sf").checked ||
		document.getElementById("input_l_f").checked
	) {
		return true
	} else {
		return false
	}
}

function validateData() {
	var ret = true
	for (rf of requiredFields) {
		// Robot requires special (radio) validation
		if (rf == "r") {
			if (!validateRobot()) {
				ret = false
			}
		} else if (rf == "l") {
			if (!validateLevel()) {
				ret = false
			}
		// Normal validation (length <> 0)
		} else if (document.getElementById("input_"+rf).value.length == 0) {
			ret = false
		}
	}
	if (ret == false) {
		alert("Enter all required values")
	}
	return ret
}

function getData() {
	var str = ''
	var rep = ''
	var start = true
	inputs = document.querySelectorAll("[id*='input_']");
	for (e of inputs) {
		code = e.id.substring(6)
		console.log(code+': '+e.value)
		radio = code.indexOf("_")
		if (radio > -1) {
			if (e.checked) {
				console.log(code+' is checked')
				if (start==false) {
					str=str+';'
				} else {
					start=false
				}
				// str=str+code.substr(0,radio)+'='+code.substr(radio+1)
				// document.getElementById("display_"+code.substr(0, radio)).value = code.substr(radio+1)
				str=str+code.substr(0,radio)+'='+e.value
				document.getElementById("display_"+code.substr(0, radio)).value = e.value
			}
		} else {
			console.log(code+" = ", e.value)
			if (start==false) {
				str=str+';'
			} else {
				start=false
			}
			if (e.value == "on") {
				if (e.checked) {
					str=str+code+'=Y'
				} else {
					str=str+code+'=N'
				}
			} else {
				str=str+code+'='+e.value.replace(";", "-")
			}
		}
		console.log(str)
	}
	return str
}

function updateQRHeader() {
	var str = 'Event: !EVENT! Match: !MATCH! Robot: !ROBOT! Team: !TEAM!'

	str = str
		.replace('!EVENT!', document.getElementById("input_e").value)
		.replace('!MATCH!', document.getElementById("input_m").value)
		.replace('!ROBOT!', document.getElementById("display_r").value)
		.replace('!TEAM!', document.getElementById("input_t").value)

	document.getElementById("display_qr-info").textContent = str

}


function qr_regenerate() {
	// Validate required pre-match date (event, match, level, robot, scouter)
	if (validateData() == false) {
		// Don't allow a swipe until all required data is filled in
		return false
	}

	// Get data
	data = getData()

	console.log("data size: ")
	console.log(data.length)

    // Regenerate QR Code
	qr.makeCode(data)

	updateQRHeader()
	return true
}

function qr_clear() {
    qr.clear()
}

function clearForm() {
	var match = 0
	var e = 0

	swipePage(-5)

	// Increment match
	match = parseInt(document.getElementById("input_m").value)
	if (match == NaN) {
		document.getElementById("input_m").value = ""
	} else {
		document.getElementById("input_m").value = match+1
	}

	// Robot
	resetRobot()

	// Clear XY coordinates
	inputs = document.querySelectorAll("[id*='XY_']");
	for (e of inputs) {
		code = e.id.substring(3)
		console.log("clearing " + code)
		console.log(code+" = ", e.value)
		e.value = ""
	}

	inputs = document.querySelectorAll("[id*='input_']");
	for (e of inputs) {
		code = e.id.substring(6)
		console.log("clearing " + code)

		// Don't clear key fields
		if (code == "m") continue
		if (code.substring(0,2) == "r_") continue
		if (code.substring(0,2) == "l_") continue
		if (code == "e") continue
		if (code == "s") continue


		console.log(code+': '+e.value)
		radio = code.indexOf("_")
		if (radio > -1) {
			if (e.checked) {
				console.log(code+' is checked')
				e.checked = false
				document.getElementById("display_"+code.substr(0, radio)).value = ""
			}
		} else {
			console.log(code+" = ", e.value)
			if (e.type=="number" || e.type=="text" || e.type=="hidden") {
				if (e.className == "counter") {
					e.value = 0
				} else {
					e.value = ""
				}
			} else if (e.type == "checkbox") {
				if (e.checked == true) {
					e.checked = false
				}
			} else {
				console.log("unsupported input type")
			}
		}
	}
	drawFields()
}

function startTouch(e) {
	initialX = e.touches[0].screenX;
};

function moveTouch(e) {
  	if (initialX === null) {
    	return;
  	}

  	var currentX = e.changedTouches[0].screenX;

  	var diffX = initialX - currentX;

	//console.log(diffX);
  	// sliding horizontally
	if (diffX/screen.width > xThreshold) {
		// swiped left
		swipePage(1);
	  	console.log("swiped left");
	} else if(diffX/screen.width < -xThreshold) {

		// swiped right
	  	swipePage(-1);
		console.log("swiped right");
	}

	initialX = null;

	//e.preventDefault();
};

function swipePage(incriment){
	if (qr_regenerate() == true) {
		slides = document.getElementById("main-panel-holder").children
		if(slide + incriment < slides.length && slide + incriment >= 0){
			slides[slide].style.display = "none";
			slide += incriment;
			//slides[slide + (incriment > 0 ? -1 : 1)].style.display = "none";
			window.scrollTo(0,0);
			slides[slide].style.display = "table";
			//console.log(slides[slide]);
		}
	}
}

function setCanvasProperties(name) {
	var img = document.getElementById("img"+name);
	var cnvs = document.getElementById("canvas"+name);

	console.log("setting up canvas: "+name)
	cnvs.style.position = img.style.position;
	// cnvs.style.left = img.offsetLeft + "px";
	// cnvs.style.top = img.offsetTop + "px";
	cnvs.style.left = img.style.left;
	cnvs.style.top = img.style.top;
	cnvs.style.width = img.width;
	cnvs.style.height = img.height;
}

function drawFields(name) {
	var fields = document.querySelectorAll("[id*='canvas_']");

	for (f of fields) {
		code = f.id.substring(7)
		var img = document.getElementById("img_"+code)
		var ctx = f.getContext("2d")
		ctx.clearRect(0,0,f.width,f.height)
		ctx.drawImage(img, 0, 0, f.width, f.height)

		var xyStr = document.getElementById("XY_"+code).value
		if (JSON.stringify(xyStr).length > 2) {
			pts = Array.from(JSON.parse(xyStr))
			for (p of pts) {
				var coord = p.split(",")
				var centerX = coord[0];
				var centerY = coord[1];
				var radius = 5;
				ctx.beginPath();
				ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#FFFFFF';
				ctx.stroke();
			}
		}
	}
}

function onFieldClick(event){
	//Resolution height and width (e.g. 52x26)
	var resL = 12;
	var resH = 6;

	let target = event.target;

	//Turns coordinates into a numeric box
	let box = ((Math.ceil(event.offsetY / target.height * resH )-1) * resL) + Math.ceil(event.offsetX / target.width * resL)
	let coords = event.offsetX + "," + event.offsetY;
	//console.log(box)

	//Cumulating values
	changingXY = document.getElementById("XY" + getIdBase(target.id));
	changingInput = document.getElementById("input" + getIdBase(target.id));

	// TODO: 2nd half of this if statement is a hack for auto start - don't allow more than one starting position
	if((JSON.stringify(changingXY.value).length > 2) && changingXY.id !== "XY_as"){
		var tempValue = Array.from(JSON.parse(changingXY.value));
		tempValue.push(coords);
		changingXY.value = JSON.stringify(tempValue);

		tempValue = Array.from(JSON.parse(changingInput.value));
		tempValue.push(box);
		changingInput.value = JSON.stringify(tempValue);
	} else{
		changingXY.value = JSON.stringify([coords]);
		changingInput.value = JSON.stringify([box]);
	}

	//setCanvasProperties(getIdBase(target.id))
	drawFields()
}

function getIdBase(name){
	return name.slice(name.indexOf("_"), name.length)
}

window.onload = function(){
	console.log("we good");
	if(typeof team_data !== undefined){
		team_data = JSON.parse(team_data);
	}
	this.drawFields()
};

function getTeamName(teamNumber){
	if(teamNumber !== undefined){
		var teamKey = "frc" + teamNumber;
		var ret = "";
		Array.from(team_data.teams).forEach(team => ret = team[teamKey] !== undefined ? team[teamKey] : ret);
		return ret;
	} else{
		return "";
	}
}

function getMatch(matchKey){
	//This needs to be different than getTeamName() because of how JS stores their data
	if(matchKey !== undefined){
		var ret = "";
		Array.from(team_data.schedule).forEach(match => ret = match.key == matchKey ? match : ret);
		return ret;
	} else{
		return "";
	}
}

function getCurrentTeamNumberFromRobot(){
	console.log(getCurrentMatch() != "");
	if(getRobot() != "" && typeof getRobot() !== undefined && getCurrentMatch() != ""){
		if(getRobot().charAt(0) == "r"){
			return getCurrentMatch().red_teams[parseInt(getRobot().charAt(1))-1]
		} else if(getRobot().charAt(0) == "b"){
			return getCurrentMatch().blue_teams[parseInt(getRobot().charAt(1))-1]
		}
	}
}

function getCurrentMatchKey(){
	return document.getElementById("input_e").value + "_" + getLevel() + document.getElementById("input_m").value;
}

function getCurrentMatch(){
	return getMatch(getCurrentMatchKey());
}

function updateMatchStart(event){
	if(getCurrentMatch() != ""){

	}
	if(event.target.name == "r"){
		document.getElementById("input_t").value = getCurrentTeamNumberFromRobot().replace("frc", "");
		onTeamnameChange();
	}
	if(event.target.name == "m"){
		if(getRobot() != "" && typeof getRobot()){
			document.getElementById("input_t").value = getCurrentTeamNumberFromRobot().replace("frc", "");
			onTeamnameChange();
		}
	}
}

function onTeamnameChange(event){
	var newNumber = document.getElementById("input_t").value;
	var teamLabel = document.getElementById("teamname-label");
	if(newNumber != "" || typeof team_data !== undefined){
		teamLabel.innerText = getTeamName(newNumber) != "" ? "You are scouting " + getTeamName(newNumber) : "That team isn't playing this match, please double check to verify correct number";
	} else{
		teamLabel.innerText = "";
	}
}
