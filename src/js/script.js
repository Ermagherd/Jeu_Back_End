window.addEventListener('DOMContentLoaded', function () {

  var tokenWs = 'token=' + $('#token').html();

  var socket = io({query: tokenWs});

  $('#reset').on('click', function () {
    socket.emit('reset', {})
  })

	///////////////////////////////////////////////////////////////
	/////                     LANCEMENT DU JEU                /////
	///////////////////////////////////////////////////////////////
	game(socket);

}, true);