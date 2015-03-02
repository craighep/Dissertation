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
      var bottom = "0%";
      if (moves.length > 0 )
        bottom = "15%";
      $('#footer').css({"bottom" : bottom});

      for (move in moves) {
        movesHtml += '<li class="move"></li>';
      }
      list.html(
        $(movesHtml)
      );
    }
  }
});

/*stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );*/
