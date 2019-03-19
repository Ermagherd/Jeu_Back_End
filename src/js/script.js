window.addEventListener('DOMContentLoaded', function () {

  var tokenWs = 'token=' + $('#token').html();
  // console.log('le token : ', tokenWs);
  // lancement web socket
  var socket = io("http://www.localhost:8888", {query: tokenWs});

	///////////////////////////////////////////////////////////////
	/////                     LANCEMENT DU JEU                /////
	///////////////////////////////////////////////////////////////
	game(socket);

}, true);