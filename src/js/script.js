window.addEventListener('DOMContentLoaded', function () {

  var tokenWs = 'token=' + $('#token').html();

  var socket = io({query: tokenWs});

  game(socket);

  $('#reset').on('click', function () {
    socket.emit('reset', {})
  })

  $('#ready').on('click', function () {
    socket.emit('ready', {})
  })

  socket.on('chrono', function(msg){
    $('#timer').text('Temps : ' + msg.chrono + 's.');
  })
  
  $('#timer').text('Temps : 0s');

  var getScores = setInterval(() => {
    socket.emit('get-scores', {})
  }, 5000);

  socket.on('your-scores', function(msg){
    $('#liste').html('')
    msg.forEach(function(element, index) {
      $('#liste').append('<p class="scores">' + (index + 1) + ' . '+ element.player1 + ' & '  + element.player2 + ' : ' + element.score + 's.')
    });
  })

	///////////////////////////////////////////////////////////////
	/////                     LANCEMENT DU JEU                /////
	///////////////////////////////////////////////////////////////
	game(socket);

}, true);