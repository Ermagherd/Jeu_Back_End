window.addEventListener('DOMContentLoaded', function () {

  // lancement web socket
  var socket = io("http://www.localhost:8888");
  var tokenWs = $('#token').html();
  console.log('le token : ', tokenWs);

	///////////////////////////////////////////////////////////////
	/////                     LANCEMENT DU JEU                /////
	///////////////////////////////////////////////////////////////
	game(socket);

}, true);