QUnit.test( "Pause Animation", function( assert ) {
  pause(false);
  assert.ok( paused == false, "Passed!" );
});
