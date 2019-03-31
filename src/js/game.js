function game(socket) {
	'use strict';
	///////////////////////////////////////////////////////////////
	/////               INITIALISATION DU CANVAS              /////
	///////////////////////////////////////////////////////////////

	var canvas = document.getElementById("canvas");
	canvas.width = 900;
	canvas.height = 480;
	var ctx = canvas.getContext("2d");
	// ctx.font = "60px Oswald";
	ctx.imageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	var couleur1 = 'rgba(255, 128, 0, 1)';
	var couleur2 = 'rgba(0, 255, 255, 1)';

	///////////////////////////////////////////////////////////////
	/////                    controlsPlayer1                  /////
	///////////////////////////////////////////////////////////////

	var controlsPlayer1 = {

		gauche: false,
		droite: false,
		haut: false,
		bas: false,
		restart: false,
		/////////////////////////////////////////
		keyUpOrDown: function (event) {

			// CHECK SI KEYDOWN OU KEYUP
			var defKey = (event.type == 'keydown') ? true : false;

			switch (event.keyCode) {

				case 37: // fleche gauche
				case 81: // A FR
				case 65: // A QWERTY
					controlsPlayer1.gauche = defKey;
					break;
				case 38: // fleche haute
				case 90: // Z FR
				case 87: // W QWERTY
				case 32: // ESPACE
					controlsPlayer1.haut = defKey;
					break;
				case 39: // fleche droite
				case 68: // D
					controlsPlayer1.droite = defKey;
					break;
				case 83: // S
				case 40: // fleche bas
					controlsPlayer1.bas = defKey;
					break;
				case 82: // R
					controlsPlayer1.restart = defKey;
					break;
			}
		},
		direction: '',
		checkDirection: function () {
			// NE PAS MODIFIER L'ORDRE DE VERIFICATION
			if (this.droite && this.haut) {
				return this.direction = 'hautDroite';
			}
			if (this.gauche && this.haut) {
				return this.direction = 'hautGauche';
			}
			if (this.droite && this.bas) {
				return this.direction = 'basDroite';
			}
			if (this.gauche && this.bas) {
				return this.direction = 'basGauche';
			}
			if (this.droite) {
				return this.direction = 'droite';
			}
			if (this.gauche) {
				return this.direction = 'gauche';
			}
			if (this.haut) {
				return this.direction = 'haut';
			}
			if (this.bas) {
				return this.direction = 'bas';
			}
			if (!this.gauche && !this.haut && !this.droite && !this.bas) {
				return this.direction = 'idle';
			}
		}
	};

	///////////////////////////////////////////////////////////////
	/////                         JOUEURS                     /////
	///////////////////////////////////////////////////////////////

	var player1 = {
    pseudo:'',
    avatar:'',
		x: null,
		y: null,
		w: null,
		h: null,
		drawPlayer: function () {
			ctx.fillStyle = couleur1;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		},
		drawAvatar: function () {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "35px Oswald";
      ctx.fillText(this.avatar, this.x + 11, this.y + 34);
		}
	}

	var player2 = {
    pseudo:'',
    avatar:'',
		x: null,
		y: null,
		w: null,
		h: null,
		drawPlayer: function () {
			ctx.fillStyle = couleur2
			ctx.fillRect(this.x, this.y, this.w, this.h);
		},
		drawAvatar: function () {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "35px Oswald";
      ctx.fillText(this.avatar, this.x + 11, this.y + 34);
		}
	}

	///////////////////////////////////////////////////////////////
	/////                        "LASERS"                     /////
	///////////////////////////////////////////////////////////////

	//  CANON
	var nouveauCanonLaser = (function (){
		var ConstructeurLaser = function (x,y,w,h) {
			this.x = x || 0;
			this.y = y || 0;
			this.w = w || 50;
			this.h = h || 50;
		}
		ConstructeurLaser.prototype.drawCanon = function () {
			ctx.fillStyle = 'rgb(128, 128, 128)'; // gris
			ctx.fillRect(this.x, this.y, this.w, this.h);
		};
		return function (x,y,w,h) {
			return new ConstructeurLaser(x,y,w,h) 
		};
	})();

	var canon1 = nouveauCanonLaser(225, 470);
	var canon2 = nouveauCanonLaser(345, 470);
	var canon3 = nouveauCanonLaser(500, 470);
	var canon4 = nouveauCanonLaser(620, 470);
	var canon5 = nouveauCanonLaser(890, 55);
	var canon6 = nouveauCanonLaser(890, 165);
	var canon7 = nouveauCanonLaser(890, 275);
	var canon8 = nouveauCanonLaser(890, 385);

	//  RAYON LASER
	var nouveauRayonLaser = (function (){
		var NouveauBeam =  function (x,y,w,h,beamColor, orientation) {
			this.x = x || 0;
			this.y = y || 0;
			this.w = w || 0;
			this.h = h || 0;
			this.beamColor = beamColor;
			this.orientation = orientation;
		}
		NouveauBeam.prototype.drawBeam = function () {
			if (this.orientation === 'up') {
				if (this.y > 0){
					this.y -= 4;
					this.h += 4;
				}
      } 
      if (this.orientation === 'down') {
				if (this.y + this.h < canvas.height){
					this.h += 4;
				}
			}
      if (this.orientation === 'left') {
				if (this.x > 0){
          this.x -= 4;
          this.w += 4;
				}
			}
      // if (this.orientation === 'down') {
			// 	if (this.y + this.h < canvas.height){
			// 		this.h += 4;
			// 	}
			// }
			ctx.fillStyle = this.beamColor; // rouge
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}
		return function (x,y,w,h,beamColor, orientation) {
			return new NouveauBeam(x,y,w,h,beamColor, orientation);
		}
	})();
	
	var rayon1 = nouveauRayonLaser(canon1.x + (canon1.w / 2) - 10, canon1.y + canon1.h, 20, 0, couleur1, 'up');
	var rayon2 = nouveauRayonLaser(canon2.x + (canon2.w / 2) - 10, canon2.y + canon2.h, 20, 0, couleur1, 'up');
	var rayon3 = nouveauRayonLaser(canon3.x + (canon3.w / 2) - 10, canon3.y + canon3.h, 20, 0, couleur1, 'up');
	var rayon4 = nouveauRayonLaser(canon4.x + (canon4.w / 2) - 10, canon4.y + canon4.h, 20, 0, couleur1, 'up');
	var rayon5 = nouveauRayonLaser(canon5.x, canon5.y + (canon5.h / 2) - 10, 0, 20, couleur2, 'left');
	var rayon6 = nouveauRayonLaser(canon6.x, canon6.y + (canon6.h / 2) - 10, 0, 20, couleur2, 'left');
	var rayon7 = nouveauRayonLaser(canon7.x, canon7.y + (canon7.h / 2) - 10, 0, 20, couleur2, 'left');
	var rayon8 = nouveauRayonLaser(canon8.x, canon8.y + (canon8.h / 2) - 10, 0, 20, couleur2, 'left');

	var ensembleRayons = [rayon1, rayon2, rayon3, rayon4, rayon5, rayon6, rayon7, rayon8];

	///////////////////////////////////////////////////////////////
	/////                        ARRIVEE                      /////
	///////////////////////////////////////////////////////////////
	
	var arriveePlayer1 = {
		x: 555,
		y: 325,
		w: 60,
		h: 60,
		drawArriveePlayer1: function () {
			ctx.strokeStyle = couleur1;
			ctx.lineWidth = 5;
			ctx.strokeRect(this.x, this.y, this.w, this.h);
		}
	}
	
	var arriveePlayer2 = {
		x: 280,
		y: 105,
		w: 60,
		h: 60,
		drawArriveePlayer2: function () {
			ctx.strokeStyle = couleur2;
			ctx.lineWidth = 5;
			ctx.strokeRect(this.x, this.y, this.w, this.h);
		}
	}
	
	///////////////////////////////////////////////////////////////
	/////                        ARRIVEE                      /////
	///////////////////////////////////////////////////////////////

	var detectionCollisionsPlayer1 = function () {

		var collision_x;
		var collision_y;
		var collision;

		(function collisionsDetection (){

			for (var i = 0; i < ensembleRayons.length; i++){
				collision_x = (player1.x < ensembleRayons[i].x + ensembleRayons[i].w) && (player1.x + player1.w > ensembleRayons[i].x)
				collision_y = (player1.y < ensembleRayons[i].y + ensembleRayons[i].h) && (player1.y + player1.h > ensembleRayons[i].y)
				collision = collision_x && collision_y

				if (collision){
					
					switch (ensembleRayons[i].beamColor){
						case couleur1:
							if (ensembleRayons[i].orientation === 'down'){
								ensembleRayons[i].h = player1.y - 10;
							} else {
								ensembleRayons[i].y = player1.y + player1.h;
							}
							console.log("collision");
							break;
            case couleur2:
              socket.emit('collision', {collision: 'player1'})
							console.log("dead");
							break;
					}
				}
			}			
		})();
	}

	var detectionCollisionsPlayer2 = function () {

		var collision_x;
		var collision_y;
		var collision;

		(function collisionsDetection (){

			for (var i = 0; i < ensembleRayons.length; i++){
				collision_x = (player2.x < ensembleRayons[i].x + ensembleRayons[i].w) && (player2.x + player2.w > ensembleRayons[i].x)
				collision_y = (player2.y < ensembleRayons[i].y + ensembleRayons[i].h) && (player2.y + player2.h > ensembleRayons[i].y)
				collision = collision_x && collision_y

				if (collision){
					
					switch (ensembleRayons[i].beamColor){
						case couleur2:
							if (ensembleRayons[i].orientation === 'left'){
								ensembleRayons[i].x = player2.x + player2.w;
								ensembleRayons[i].w = canvas.width - (player2.x + player2.w);
							} else {
								ensembleRayons[i].y = player2.y + player2.h;
							}
							console.log("collision");
							break;
            case couleur1:
              socket.emit('collision', {collision: 'player2'})
							console.log("dead");
							break;
					}
				}
			}			
		})();
	}

  // IO
  socket.on('starterInfos', function (msg) {
    player1.pseudo = msg.player1Pseudo;
    player1.avatar = msg.player1Avatar;
    player1.x = msg.player1X;
    player1.y = msg.player1Y;
    player1.w = msg.player1W;
    player1.h = msg.player1H;
    player2.pseudo = msg.player2Pseudo;
    player2.avatar = msg.player2Avatar;
    player2.x = msg.player2X;
    player2.y = msg.player2Y;
    player2.w = msg.player2W;
    player2.h = msg.player2H;
    console.log(msg)
	})

	socket.on('positions-datas', function (msg) {
		player1.x = msg.player1X;
		player1.y = msg.player1Y;
		player2.x = msg.player2X;
		player2.y = msg.player2Y;
	})

	///////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////
	/////                   BOUCLE ANIMATION                  /////
	///////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////

	var animationJeu = function (timestamp) {
		// clear du canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		///////////////////////////////////////////////////////////////
		/////                       BACKGROUND                    /////
		///////////////////////////////////////////////////////////////

		ctx.fillStyle = 'rgba(33, 37, 41, 1)'; // fond idem site
		ctx.fillRect(0, 0, canvas.width, canvas.height); // fond blanc

		///////////////////////////////////////////////////////////////
		/////                 REPONSES AUX KEYPRESS               /////
		///////////////////////////////////////////////////////////////

		controlsPlayer1.checkDirection();

		// PLAYER 1
		
		///////////////////////////////////////////////////////////////
		/////                      COLLISIONS                     /////
		///////////////////////////////////////////////////////////////

		detectionCollisionsPlayer1();
		detectionCollisionsPlayer2();

		// WIN
		var player1Win = (player1.x > arriveePlayer1.x && player1.y > arriveePlayer1.y && player1.x + player1.w < arriveePlayer1.x + arriveePlayer1.w && player1.y + player1.h < arriveePlayer1.y + arriveePlayer1.h);
		var player2Win = (player2.x > arriveePlayer2.x && player2.y > arriveePlayer2.y && player2.x + player2.w < arriveePlayer2.x + arriveePlayer2.w && player2.y + player2.h < arriveePlayer2.y + arriveePlayer2.h);
		(function () {
			if (player1Win && player2Win) {
			ctx.save();
			ctx.font = "40px Oswald";
			ctx.fillStyle = couleur1;
			ctx.fillText('WIN !', 410, 262);
      ctx.restore();
      socket.emit('win', {});
			}
		})();
		///////////////////////////////////////////////////////////////
		/////                    MAJ DES ELEMENTS                 /////
		///////////////////////////////////////////////////////////////
		
		// BEAMS
		rayon1.drawBeam();
		rayon2.drawBeam();
		rayon3.drawBeam();
		rayon4.drawBeam();
		rayon5.drawBeam();
		rayon6.drawBeam();
		rayon7.drawBeam();
		rayon8.drawBeam();

		// CANON
		canon1.drawCanon();
		canon2.drawCanon();
		canon3.drawCanon();
		canon4.drawCanon();
		canon5.drawCanon();
		canon6.drawCanon();
		canon7.drawCanon();
		canon8.drawCanon();
		
		// ARRIVEES
		arriveePlayer1.drawArriveePlayer1();
		arriveePlayer2.drawArriveePlayer2();

		// PLAYERS
		player1.drawPlayer();
		player2.drawPlayer();
		player1.drawAvatar();
		player2.drawAvatar();

		// IO

		// console.log(player1.x, player1.y)
		// récursion

		window.requestAnimationFrame(animationJeu);

	};

	// EMIT
	var playerDatas;
	var intervalId;
	function transfertDatas (){
		playerDatas = {
			playerDirection: controlsPlayer1.direction
		};
		socket.emit('player-datas', playerDatas)
	}
	(function transfert() {
		intervalId = setInterval(transfertDatas, 15);
	})();

	// ON

	// INITIALISATION DES EVENT LISTENERS
	window.addEventListener('keydown', controlsPlayer1.keyUpOrDown, true);
	window.addEventListener('keyup', controlsPlayer1.keyUpOrDown, true);

	// SNIPPET COMPATIBILITE REQUESTANIMATIONFRAME
	if (!window.requestAnimationFrame) {
		var lastTime = 0;
		window.requestAnimationFrame = (function () {
			return window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					var currTime = new Date().getTime();
					var timeToCall = Math.max(0, 16 - (currTime - (lastTime - 3)));
					var id = window.setTimeout(function () {
							callback(currTime + timeToCall);
						},
						timeToCall);
					lastTime = currTime + timeToCall;
					return id;
				};
		})();
	}

	// INITIALISATION DE LA BOUCLE D'ANIMATION
	animationJeu();

};