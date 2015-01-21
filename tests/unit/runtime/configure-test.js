import runtime from 'ember-insights/runtime';


module('Runtime configuration');


test('configuration by default', function() {
  // case #1
  var addon = { configs: [] };
  runtime(addon).configure();
  var settings = addon.configs['default'];
  ok(settings);

  // case #2
  addon = { configs: [] };
  runtime(addon).configure('test');
  settings = addon.configs['test'];

  ok(settings);
  equal(settings.trackerFun, 'ga');
  equal(settings.trackingNamespace, '');
  equal(typeof settings.trackerFactory === 'function');
  equal(typeof settings.tracker === 'object');
  equal(settings.trackTransitionsAs, 'pageview');
  equal(settings.updateDocumentLocationOnTransitions, true);
  equal(settings.mappings.length, 0);
});

test('setting configuration params', function() {
  // case #1
  var addon    = { configs: [] };
  var settings = { updateDocumentLocationOnTransitions: false };
  runtime(addon).configure('test', settings);
  settings = addon.configs['test'];

  ok(settings);
  equal(settings.updateDocumentLocationOnTransitions, false);
  equal(settings.mappings.length, 0);
});
