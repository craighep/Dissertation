define(['jquery'], function ($) {
  return {
      addContent: function(renderer) {
      var controls = $('#controls');
      console.log(controls.css);
      var dropdown = $('#dropdown');
      var s;

      for (s in splines) {
          dropdown.append(
              $('<option></option>').val(s).html(s)
            );
      }
      $('#container').append(renderer.domElement);
    }
  }

});

/*stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );*/
