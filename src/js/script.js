window.addEventListener('DOMContentLoaded', function () {

  // lancement web socket
  var socket = io("http://www.localhost:8888");
  console.log(tokenWs);

	///////////////////////////////////////////////////////////////
	/////                     LANCEMENT DU JEU                /////
	///////////////////////////////////////////////////////////////
	game(socket);

}, true);