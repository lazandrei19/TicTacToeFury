var sCs = ["0000000000", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000"]; //Small Cells
var bC = "000000000";
var active = 1; //Active Player
var activepP = -1; //Active Big Cell
var socket = io.connect('http://192.168.3.101:8080');
var thisMove;
var me;
var lastMove = null;

var tC = (active == 1)? "red" : "blue";

$(".big-cell-" + tC + " .small-cell-unocupied").click(function (event) {

	var color = (active == 1)? "red" : "blue";

	var tCt = event.target.offsetTop,	//Target Cell Top
		tCl = event.target.offsetLeft, 	//Target Cell Left
		pCt = event.target.parentElement.offsetTop,		//Parent Cell Top
		pCl = event.target.parentElement.offsetLeft;	//Parent Cell Left

	var bSize = event.target.parentElement.parentElement.offsetWidth; //Board Size
	var bCSize = (bSize - 6) / 3; 	//Big Cell Size
	var sCSize = bCSize / 3; 		//Small Cell Size
	
	var cP = tCl / sCSize + (tCt / sCSize * 3),		//Child position
		pP = Math.floor(pCl / bCSize) + (Math.floor(pCt / bCSize) * 3);		//Parent position

	
	if(me == active){
		if(activepP == -1 || activepP == pP) {
			var childData = sCs[pP].split("");
			if(childData[cP] == 0){
				childData[cP] = active;
				var finishedData = childData.join("");
				sCs[pP] = finishedData;
				var tmp = detectWin(pP);
				if(tmp != 0) {
					var tmp2 = sCs[pP].split("");
					tmp2[9] = tmp;
					sCs[pP] = tmp2.join("");
					var won = (active == 1)? "red" : "blue";
					$(".over.bCellWon")[pP].className = "over bCellWon " + won;
					var updater = bC.split("");
					updater[pP] = active;
					bC = updater.join("");
					var wonGame = detectWinGame();
					if(wonGame != 0) {
						alert(won + " won the game");
					}
				}
				event.target.className = "small-cell-" + color;
				activepP = cP;
				var thisColor = (active == 2)? "red" : "blue";
				if(sCs[activepP].indexOf(0) == -1){
					activepP = -1;
					$(".over").removeClass("inactive");
					$(".big-cell-" + color +", .big-cell-inactive").removeClass().addClass("big-cell-" + thisColor);
				} else {
					$(".main-board>div").removeClass().addClass("big-cell-inactive");
					$(".over.aon").removeClass("active").addClass("inactive");
					$(".over.inactive")[cP].className = "over aon active";
					$(".main-board>div")[cP].className = "big-cell-" + thisColor;
				}
				lastMove = pP * 10 + cP;
				socket.emit('move', (me*100 + pP*10 + cP));
				active = (active == 2)? 1 : 2;
			}
		}
	}
});

function detectWin (id) {
	var data = sCs[id].split("");
	console.log(data);
	if(data[9] == 0) {
		if((data[0] == data[1]) && (data[1] == data[2]) && (data[0] != 0)) {
			return data[0];
		} else if((data[3] == data[4]) && (data[4] == data[5]) && (data[3] != 0)) {
			console.log(data[3]);
			return data[3];
		} else if((data[6] == data[7]) && (data[7] == data[8]) && (data[6] != 0)) {
			console.log(data[6]);
			return data[6];
		} else if((data[0] == data[3]) && (data[3] == data[6]) && (data[0] != 0)){
			return data[0];
		} else if((data[1] == data[4]) && (data[4] == data[7]) && (data[1] != 0)){
			console.log(data[1]);
			return data[1];
		} else if((data[2] == data[5]) && (data[5] == data[8]) && (data[2] != 0)){
			console.log(data[2]);			
			return data[2];
		} else if((data[0] == data[4]) && (data[4] == data[8]) && (data[0] != 0)){
			return data[0];
		} else if((data[2] == data[4]) && (data[4] == data[6]) && (data[2] != 0)){
			return data[2];
		} else {
			return 0;
		}
	} else {
		return 0;
	}
}

function detectWinGame () {
	var data = bC.split("");
	if((data[0] == data[1]) && (data[1] == data[2]) && (data[0] != 0)) {
		return data[0];
	} else if((data[3] == data[4]) && (data[4] == data[5]) && (data[3] != 0)) {
		console.log(data[3]);
		return data[3];
	} else if((data[6] == data[7]) && (data[7] == data[8]) && (data[6] != 0)) {
		console.log(data[6]);
		return data[6];
	} else if((data[0] == data[3]) && (data[3] == data[6]) && (data[0] != 0)){
		return data[0];
	} else if((data[1] == data[4]) && (data[4] == data[7]) && (data[1] != 0)){
		console.log(data[1]);
		return data[1];
	} else if((data[2] == data[5]) && (data[5] == data[8]) && (data[2] != 0)){
		console.log(data[2]);			
		return data[2];
	} else if((data[0] == data[4]) && (data[4] == data[8]) && (data[0] != 0)){
		return data[0];
	} else if((data[2] == data[4]) && (data[4] == data[6]) && (data[2] != 0)){
		return data[2];
	} else {
		return 0;
	}
}

socket.on('isPlaying', function (data) {
	$(".loader").hide();
	$(".all").show();
	console.log(data);
	me = data.ag;
	if(data.ag == 2) {
		socket.emit('last');
	}
	socket.emit('against', data.id);
});

socket.on('opponent', function (move) {
	socket.emit('opmove', move);
	var cP = move % 10;
	var pP = Math.floor((move / 10) % 10);
	var who = Math.floor((move / 100) % 10);
	var childData = sCs[pP].split("");
	var color = (active == 1)? "red" : "blue";
	if(childData[cP] == 0){
		childData[cP] = active;
		var finishedData = childData.join("");
		sCs[pP] = finishedData;
		var tmp = detectWin(pP);
		if(tmp != 0) {
			var tmp2 = sCs[pP].split("");
			tmp2[9] = tmp;
			sCs[pP] = tmp2.join("");
			var won = (active == 1)? "red" : "blue";
			$(".over.bCellWon")[pP].className = "over bCellWon " + won;
			var updater = bC.split("");
			updater[pP] = active;
			bC = updater.join("");
			var wonGame = detectWinGame();
			if(wonGame != 0) {
				alert(won + " won the game");
			}
		}
		event.target.className = "small-cell-" + color;
		activepP = cP;
		var thisColor = (active == 2)? "red" : "blue";
		if(sCs[activepP].indexOf(0) == -1){
			activepP = -1;
			$(".over").removeClass("inactive");
			$(".big-cell-" + color +", .big-cell-inactive").removeClass().addClass("big-cell-" + thisColor);
		} else {
			$(".main-board>div").removeClass().addClass("big-cell-inactive");
			$(".over.aon").removeClass("active").addClass("inactive");
			$(".over.inactive")[cP].className = "over aon active";
			$(".main-board>div")[cP].className = "big-cell-" + thisColor;
		}
	}
	active = (active == 2)? 1 : 2;
});