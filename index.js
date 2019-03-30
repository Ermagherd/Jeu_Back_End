'use strict';

////////////////////////////////////////////////
////                 REQUIRE                ////
////////////////////////////////////////////////

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
const dbname = 'IFOCOP-BACKEND';
const ObjectID = require('mongodb').ObjectID;
// SESSION
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// COOKIE PARSER
const cookieParser = require('cookie-parser');
// PUG
const pug = require('pug');

////////////////////////////////////////////////
////               MIDDLEWARE               ////
////////////////////////////////////////////////

// STATICS
app.use('/html', express.static(__dirname + '/src/html'));
app.use('/img', express.static(__dirname + '/src/img'));
app.use('/css', express.static(__dirname + '/src/css'));
app.use('/js', express.static(__dirname + '/src/js'));
app.use('/vendor', express.static(__dirname + '/src/vendor'));
// PUG
app.set('view engine', 'pug');
app.set('views', './views');
// PARSERS
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
// SESSIONS
const username = "Bertmern";
const password = "DatMongoatlaspass2019";
const mongoDbUrl = `mongodb://${username}:${password}@cluster0-shard-00-00-egm2w.mongodb.net:27017,cluster0-shard-00-01-egm2w.mongodb.net:27017,cluster0-shard-00-02-egm2w.mongodb.net:27017/IFOCOP-BACKEND?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`;
app.use(session({
  secret: 'And death shall have no dominion',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    url: mongoDbUrl,
    ttl: 14 * 24 * 60 * 60, // save session 14 days
  }),
  cookie: {
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // expires in 14 days
  },
}));

// TOKEN GENERATOR
var rand = function () {
  return Math.random().toString(36).substr(2); // remove `0.`
};
var token = function () {
  return rand() + rand() + rand(); // to make it longer
};

////////////////////////////////////////////////
////                 ROUTES                 ////
////////////////////////////////////////////////

app.get('/', function (req, res, next) {
  const client = new MongoClient(url, {
    useNewUrlParser: true
  });
  client.connect(err => {
    if (err) {
      res.statusCode == 503;
      next();
    } else {
      const collection = client.db(dbname).collection("sessions");
      collection.find({
        _id: req.sessionID
      }).toArray(function (err, sessionConnectMongo) {
        if (err) {
          res.statusCode == 503;
          next();
        } else {
          // if session exist
          if (sessionConnectMongo.length > 0) {
            if (sessionConnectMongo[0].pseudo === undefined || sessionConnectMongo[0].pwd === undefined) {
              res.render('connexion');
            } else {
              var newToken = token() // crea d'un token et inscription de celui ci en bdd
              try {
                collection.updateOne({
                  "_id": req.sessionID
                }, {
                  $set: {
                    "pseudo": sessionConnectMongo[0].pseudo,
                    "pwd": sessionConnectMongo[0].pwd,
                    "token": newToken
                  }
                });
              } catch (e) {
                print(e);
              }
              res.render('accueil', {
                pseudo: sessionConnectMongo[0].pseudo,
                tokenWs: newToken
              });
            }
          } else {
            // if user needs to connect
            res.render('connexion');
          }
        }
      })
    }
  });
})

app.get('/accueil', function (req, res, next) {
  const client = new MongoClient(url, {
    useNewUrlParser: true
  });
  client.connect(err => {
    if (err) {
      res.statusCode == 503;
      next();
    } else {
      const collection = client.db(dbname).collection("sessions");
      collection.find({
        _id: req.sessionID
      }).toArray(function (err, sessionConnectMongo) {
        if (err) {
          res.statusCode == 503;
          next();
        } else {

          if (sessionConnectMongo.length > 0) {

            if (!sessionConnectMongo[0].pseudo || !sessionConnectMongo[0].pwd) {
              res.render('connexion');
            } else {
              var newToken = token() // crea d'un token et inscription de celui ci en bdd
              try {
                collection.updateOne({
                  "_id": req.sessionID
                }, {
                  $set: {
                    "pseudo": sessionConnectMongo[0].pseudo,
                    "pwd": sessionConnectMongo[0].pwd,
                    "token": newToken
                  }
                });
              } catch (e) {
                print(e);
              }
              res.render('accueil', {
                pseudo: sessionConnectMongo[0].pseudo,
                tokenWs: newToken
              });
            }

          } else {
            // if user needs to connect
            res.render('connexion');
          }
        }
      })
    }
  });
})

app.post('/accueil', function (req, res, next) {
  // if session ID et identifiants existent => res.render('accueil')
  const client = new MongoClient(url, {
    useNewUrlParser: true
  });
  client.connect(err => {
    if (err) {
      res.statusCode == 503;
      next();
    } else {
      const collection = client.db(dbname).collection("sessions");
      collection.find({
        _id: req.sessionID
      }).toArray(function (err, sessionConnectMongo) {
        // console.log('la session : ', sessionConnectMongo[0].pseudo)
        if (err) {
          res.statusCode == 503;
          next();
        } else {

          if (sessionConnectMongo.length > 0) {

            if (!sessionConnectMongo[0].pseudo || !sessionConnectMongo[0].pwd) {
              var newToken = token() // crea d'un token et inscription de celui ci en bdd
              try {
                collection.updateOne({
                  "_id": req.sessionID
                }, {
                  $set: {
                    "pseudo": req.body.name,
                    "pwd": req.body.pwd,
                    "token": newToken
                  }
                });
              } catch (e) {
                print(e);
              }
              res.render('accueil', {
                pseudo: req.body.name,
                tokenWs: newToken
              });
            } else {
              // if session exist
              // var newToken = token()
              res.render('accueil', {
                pseudo: sessionConnectMongo[0].pseudo,
                // tokenWs: newToken
              });
            }

          } else {
            // if user needs to connect
            res.render('connexion');
          }
        }
      })
    }
  });
})

// récupération de la liste des users côté client // AJAX
app.get("/usersFetch", function (req, res, next) {
  const client = new MongoClient(url, {
    useNewUrlParser: true
  });
  client.connect(err => {
    if (err) {
      res.statusCode == 503;
      next();
    } else {
      const collection = client.db(dbname).collection("sessions");
      collection.find({}).toArray(function (err, sessionConnectMongo) {
        console.log('la session : ', sessionConnectMongo[0].pseudo)
        if (err) {
          res.statusCode == 503;
          next();
        } else {
          let users = [];
          sessionConnectMongo.forEach(element => {
            users.push(element.pseudo)
          });
          res.send(users);
        }
      })
    }
  });
})

// GESTION DES ERREURS

app.use(function (req, res, next) {
  // test l'entête de la réponse
  if (res.statusCode == 503) {
    res.send('Serveur indisponible. Veuillez réessayer ultérieurement');
  } else {
    // si erreur par défaut : status passé à 404 avant d'envoyer la réponse
    res.status(404).send('Fichier non trouvé');
  }
});


const gE = require('game-engine');

let playersList = {};
let gameReady = false;
let playersReady = false;

// IO

io.on('connection', function (socket) {

  // association du user et du socket.id
  const client = new MongoClient(url, {
    useNewUrlParser: true
  });
  client.connect(err => {
    if (err) {
      throw err
    } else {
      let token = socket.handshake.query.token;
      token = token.replace(/\s+/g, '');
      // console.log(token)
      const collection = client.db(dbname).collection("sessions");
        collection.updateOne({
          "token": token
        }, {
          $set: { token: "", socketID: socket.id}
        })
        // collection.findOne({socketID: socket.id}, function (err, result) {
        //   if (err) {
        //     throw err
        //   } else {
        //       console.log(result.pseudo)
        //       playersList[socket.id] = {
        //         pseudo: result.pseudo,
        //         x: 100,
        //         y: 100,
        //         w: 50,
        //         h: 50
        //       }
        //       console.log(playersList);
        //   }
        // })
      }
    });
    
  console.log(socket.id)
  socket.on('player-datas', function (msg) {

    // identification du player ayant émis les datas


    // appelle une fonction du module game engine pour update les pos x et y du joueur
    // var upDatePositionJoueur = gE.game.deplacement(msg.playerDirection, playersList[socket.id].x, playersList[socket.id].y);
    // playersList[socket.id].x = upDatePositionJoueur.newPosX;
    // playersList[socket.id].y = upDatePositionJoueur.newPosY;
    // console.log(upDatePositionJoueur);

    io.emit('positions-datas', {
      // player: playersList[socket.id],
      // newPosX: playersList[socket.id].x,
      // newPosY: playersList[socket.id].y
    });



  });

  socket.on('disconnect', function () {
    delete playersList[socket.id];
  });

})


// LISTEN

http.listen(8888, function () {
  console.log(`A l'écoute sur 8888`);
})