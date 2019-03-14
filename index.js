'use strict';

// EXPRESS
const express = require('express');
const app = express();
const http = require('http').Server(app);
//  IO
const io = require('socket.io')(http);
// BODYPARSER
const bodyParser = require('body-parser');
// MONGO
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://Bertmern:DatMongoatlaspass2019@cluster0-egm2w.mongodb.net/test?retryWrites=true";
const uri = "mongodb+srv://Bertmern:DatMongoatlaspass2019@cluster0-egm2w.mongodb.net/test/";
const dbname = 'IFOCOP-BACKEND';
// SESSION
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// COOKIE PARSER
const cookieParser = require('cookie-parser');
// PUG
const pug = require('pug');

// MIDDLEWARE

app.use('/html', express.static(__dirname + '/src/html'));
app.use('/img', express.static(__dirname + '/src/img'));
app.use('/css', express.static(__dirname + '/src/css'));
app.use('/js', express.static(__dirname + '/src/js'));
app.use('/vendor', express.static(__dirname + '/src/vendor'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.urlencoded({extended: false}));

// app.use(cookieParser()) no longer needed 
app.use(session({
	secret:'And death shall have no dominion',
	saveUninitialized : false,
	resave: false,
	store: new MongoStore({
		url: uri,
		touchAfter: 24 * 3600 // time period in seconds
	})
}));

// ROUTES

app.get('/', function (req,res, next) {
	res.render('connexion');
})

// ERREURS

app.use(function(req,res,next){
	// test l'entête de la réponse
	if (res.statusCode == 503){
		res.send('Accès non autorisé')
	} else {
		// si erreur par défaut : status passé à 404 avant d'envoyer la réponse
		res.status(404).send('Fichier non trouvé');
	}
});

// CONNECTION DB
const client = new MongoClient(url, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db(dbname).collection("users");
    collection.find({}).toArray(function(err, docs) {
      console.log(docs)
  // perform actions on the collection object
    })
  client.close();
});

const gE = require('game-engine');

// IO
let playersList  = {};

io.on('connection', function (socket) {
	
	playersList[socket.id] = {
		pseudo: '',
		x: 100,
		y: 100,
		w: 50,
		h: 50
	}

	// console.log(playersList);

	socket.on('player-datas', function(msg){
		// appelle une fonction du module game engine pour update les pos x et y du joueur
		var upDatePositionJoueur = gE.game.deplacement(msg.playerDirection, playersList[socket.id].x, playersList[socket.id].y);
		playersList[socket.id].x = upDatePositionJoueur.newPosX;
		playersList[socket.id].y = upDatePositionJoueur.newPosY;
		// console.log(upDatePositionJoueur);

		io.emit('positions-datas', {
			player: playersList[socket.id],
			newPosX: playersList[socket.id].x,
			newPosY: playersList[socket.id].y
		});
		


	});
	
	socket.on('disconnect', function(){
		// delete playersList[socket.id];
	});

})

// LISTEN

http.listen(8888, function(){
	console.log(`A l'écoute sur 8888`);
})