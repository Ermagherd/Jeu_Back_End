window.addEventListener('DOMContentLoaded', function () {

  var tokenWs = 'token=' + $('#token').html();

  var socket = io({query: tokenWs});

	///////////////////////////////////////////////////////////////
	/////                     LANCEMENT DU JEU                /////
	///////////////////////////////////////////////////////////////
	game(socket);

}, true);