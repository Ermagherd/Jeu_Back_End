'use strict';

window.addEventListener('DOMContentLoaded', function () {

  $('#name').focus(function (e) {
    $('#name').parent().children('p').hide()
  })
  $('#pwd').focus(function (e) {
    $('#pwd').parent().children('p').hide()
  })
  $('#pwd-check').focus(function (e) {
    $('#pwd-check').parent().children('p').hide()
  })
  
  // verif des idenfiants de connexion
  $('#connexionForm').submit(function (e) {
    e.preventDefault();

    // récupération des pseudos existants
    var listePseudos;
    $.ajax({
      type: "GET",
      url: "/usersFetch",
      async: false,
      success: function(users) {
        console.log(users);
        listePseudos = users;
      }
    });

    var name = $('#name').val();
    var pwd = $('#pwd').val();
    var confPwd = $('#pwd-check').val();
    var pseudoExistant = listePseudos.includes(name);
		var valid = false;

    if (name === ''){
      $('#name').parent().children('p').html('Veuillez renseigner un pseudonyme.')
      $('#name').parent().children('p').show()
    }
    if (pseudoExistant){
      $('#name').parent().children('p').html('Ce pseudonyme est déjà pris par un autre utilisateur.')
      $('#name').parent().children('p').show()
    }
    if (pwd === ''){
      $('#pwd').parent().children('p').html('Veuillez renseigner un password.')
      $('#pwd').parent().children('p').show()
    }
    if (pwd !== confPwd){
      $('#pwd-check').parent().children('p').html('Les 2 mots de passe ne sont pas identiques')
      $('#pwd-check').parent().children('p').show()
    }

    if ('' !== name && '' !== pwd && '' !== confPwd && pwd === confPwd && pseudoExistant === false){
			valid = true;
    }

		if (valid) {
			this.submit();
		}
	})
	
}, true);