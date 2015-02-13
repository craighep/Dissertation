define(function () {

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
  var renderer;
  var camera;
var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;
var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var mouseY = 0;
var mouseYOnMouseDown = 0;


  function onDocumentMouseDown(event) {

      event.preventDefault();
      renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
      renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
      renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
      renderer.domElement.addEventListener('mouseout', onDocumentMouseOut, false);
      mouseXOnMouseDown = event.clientX - windowHalfX;
      mouseYOnMouseDown = event.clientY - windowHalfY;
      targetRotationOnMouseDownX = targetRotationX;
      targetRotationOnMouseDownY = targetRotationY;

  }

  function onDocumentMouseMove(event) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
      targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;
      targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
  }

  function onDocumentMouseUp(event) {
      renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
      renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
      renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);
  }

  function onDocumentMouseOut(event) {
      renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
      renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
      renderer.domElement.removeEventListener('mouseout', onDocumentMouseOut, false);
  }

  function onDocumentTouchStart(event) {

      if (event.touches.length == 1) {
          event.preventDefault();
          mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
          targetRotationOnMouseDownX = targetRotationX;
          mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
          targetRotationOnMouseDownY = targetRotationY;
      }
  }

  function onDocumentTouchMove(event) {

      if (event.touches.length == 1) {
          event.preventDefault();
          mouseX = event.touches[0].pageX - windowHalfX;
          targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.05;
          mouseY = event.touches[0].pageX - windowHalfX;
          targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;
      }
  }

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

return {

  init: function (r, c) {
    renderer = r;
    camera = c;
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
    renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);
    window.addEventListener('resize', onWindowResize, false);
  },

    getLatestTargetRotationX: function () {
       return targetRotationX;
    },

      getLatestTargetRotationY: function () {
         return targetRotationY;
      }
  }



});
