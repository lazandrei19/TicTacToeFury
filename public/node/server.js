var client = require('socket.io').listen(8080).sockets;
var mongo = require('mongodb').MongoClient;
var clients = {};
var clientsIDs = [];

mongo.connect("mongodb://127.0.0.1/tictactoe", function(err, db) {
	if(err) throw err;

	client.on('connection', function (socket) {
		var moves = db.collection('moves');
		var sCs = ["0000000000", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000", "0000000000"];
		var bC = "000000000";
		var active = 1; //Active Player
		var activepP = -1; //Active Big Cell
		var against;
		var me = 1;
		clients[socket.id] = socket;
		if(clientsIDs.length > 0) {
			against = clientsIDs.pop();
			var playing = Math.floor(Math.random() * 2) + 1;
			socket.emit('isPlaying', {ag: playing, id: against});
			var ag = (playing == 1)? 2 : 1;
			clients[against].emit('isPlaying', {ag: ag, id: socket.id});
		} else {
			clientsIDs.push(socket.id);
		}

		socket.on('last', function () {
			me = 2;
		});

		socket.on('against', function (id) {
			against = id;
		});

		socket.on('move', function (move) {
			var cP = move % 10;
			var pP = Math.floor((move / 10) % 10);
			var who = Math.floor((move / 100) % 10);

			//console.log(me+":"+who+":"+active);

			if(who == me && me == active && (pP == activepP || activepP == -1)) {
				console.log('working');
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
						var updater = bC.split("");
						updater[pP] = active;
						bC = updater.join("");
						var wonGame = detectWinGame();
					}
					activepP = cP;
					if(sCs[activepP].indexOf(0) == -1){
						activepP = -1;
					}

					//push to db

					clients[against].emit('ping');
					clients[against].emit('opponent', move);
					console.log("before:"+active);
					active = (active == 2)? 1 : 2;
					console.log("after:"+active);
				}
			}
		});

		socket.on('opmove', function (move) {
			var cP = move % 10;
			var pP = Math.floor((move / 10) % 10);
			var who = Math.floor((move / 100) % 10);
			var opme = (me == 2)? 1 : 2;

			//console.log(me+":"+who+":"+active);

			if(who == opme && opme == active && (pP == activepP || activepP == -1)) {
				console.log('working');
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
						var updater = bC.split("");
						updater[pP] = active;
						bC = updater.join("");
						var wonGame = detectWinGame();
					}
					activepP = cP;
					if(sCs[activepP].indexOf(0) == -1){
						activepP = -1;
					}

					//push to db

					clients[against].emit('ping');
					clients[against].emit('opponent', move);
					console.log("before:"+active);
					active = (active == 2)? 1 : 2;
					console.log("after:"+active);
				}
			}
		});

		socket.on('disconnect', function () {
			delete clients[socket.id];
			clientsIDs.splice(clientsIDs.indexOf(socket.id), 1);
		});

		function detectWin (id) {
			var data = sCs[id].split("");
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
	});
});