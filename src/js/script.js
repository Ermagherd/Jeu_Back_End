window.addEventListener('DOMContentLoaded', function () {

  // lancement web socket
  var socket = io("http://www.localhost:8888");
  
  // verif des idenfiants de connexion
  $('#sendMessageButton').submit(function (e) {
    e.preventDefault();
    console.log('in');
  })

	///////////////////////////////////////////////////////////////
	/////                     LANCEMENT DU JEU                /////
	///////////////////////////////////////////////////////////////
	game(socket);

}, true);