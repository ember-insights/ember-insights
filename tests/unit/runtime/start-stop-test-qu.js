import runtime from 'ember-insights/runtime';


module('Engine Start/Stop');


test('try to start', function() {
  function attempt() {
    var addon = { configs: [] };
    runtime(addon).configure().start();
  }

  throws(attempt);
});

test('start behavior', function() {
  var addon = { configs: [] };
  runtime(addon).configure('test').start('test');
  ok(addon.isActivated);
});

test('stop behavior', function() {
  var addon = { configs: [] };
  runtime(addon).configure('test').stop();
  ok(!addon.isActivated);
});
