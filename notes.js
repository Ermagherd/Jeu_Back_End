/*

///////////////////////////////////////////////////
/* sessions via ws

A la connection, en + de la création d'une session via express session,
je vais créer un token, JSON WEB TOKEN, qui est une chaine de caractère aléatoire
et c'est DANS LE CONTENU DE LA PAGE, dans le html, que je vais passer une variable
var jws = 'sdkfoiejKDJFOkdjfkasfieL' et c'est avec cette variable que je vais checker l'identité
de mon client
j'ajoute cette var à mon upgrade protocol lors du premier appel ws.
une fois dans ws, je me sers de cette variable pour aller checker quelle est l'utilisateur qui correspond à ce token et du coup j'ai récup l'id du user hors du protocole HTTP.
Une fois l'utilisateur retrouvé, je peux, par sécurité, delete le token dans la bdd des users. Ainsi, personne d'autre ne peut se connecter. La connection étant persistante en ws, le jeton n'a plus d'utilité
///////////////////////////////////////////////////

1 -
requete de la page d'accueil par le user usr le server node

2 -
app.get('/') de la requete.

3 - 
verif de l'utilisateur
// verif du cookie
ou
// connect a mongodb
=> if user exist res.render de la page d'accueil
=> if not res.render de la page de connexion

4 -
user sur page d'accueil

// options
* option 1 seule "room" de jeu
le user connecté est envoyé dans la room en question. et attend un joueur 2. ]
setInterval de verif si un autre utilisateur s'est connecté

* option 2 plusieurs "room" disponibles, visibles comme des blocs
a l'arrivee sur la page d'accueil, le user peut choisir la room qu'il veut rejoindre/
setInterval de verif si un autre utilisateur s'est connecté

5 - Quand 2 users sont connectés dans la même roo
le canvas devient visible et le jeu se lance



