define(['jquery'], function ($) {
  return {
    addContent: function(renderer) {
      var dropdown = $('#dropdown');
      var s;

      for (s in splines) {
          dropdown.append(
              $('<option></option>').val(s).html(s)
            );
      }
      $('#container').append(renderer.domElement);
    },
    addMoveReel: function(moves) {
      var list = $('.moves');
      var movesHtml = "";
      for (move in moves) {
        movesHtml += '<li class="move"></li>';
      }
      list.html(
        $(movesHtml)
      );
    },
    showAbout: function(show) {
      var display = "none";
      if(show)
        display = "block";
      $("#aboutText").css({"display":display});
      $("#helpText").css({"display":"none"});
    },
    showHelp: function(show) {
      var display = "none";
      if(show)
        display = "block";
      $("#helpText").css({"display":display});
      $("#aboutText").css({"display":"none"});
    }
  }
});

/*stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );*/
