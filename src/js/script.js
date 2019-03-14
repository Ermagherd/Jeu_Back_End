window.addEventListener('DOMContentLoaded', function () {

  // lancement web socket
  var socket = io("http://www.localhost:8888");

	///////////////////////////////////////////////////////////////
	/////                     LANCEMENT DU JEU                /////
	///////////////////////////////////////////////////////////////
	game(socket);

}, true);