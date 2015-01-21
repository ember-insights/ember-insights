import runtime from 'ember-insights/runtime';


module('Tracking configuration');


test('basic insights', function() {
  var addon   = { configs: [] };
  var mapping = {
    insights: { ALL_TRANSITIONS:true, ALL_ACTIONS:true }
  };
  runtime(addon).configure().track(mapping);

  var settings = addon.configs['default'];
  ok(settings);
  ok(settings.mappings);
  equal(settings.trackerFun, 'ga');
  equal(settings.trackingNamespace, '');
  equal(typeof settings.trackerFactory === 'function');
  equal(typeof settings.tracker === 'object');
  equal(settings.mappings.length, 1);
  ok(settings.mappings[0].insights.get('ALL_TRANSITIONS'));
  ok(settings.mappings[0].insights.get('ALL_ACTIONS'));
});

test('custom tracking options', function() {
  var addon   = { configs: [] };
  var mapping = {
    trackerFun: 'trackerFun',
    trackingNamespace: 'trackingNamespace',
    insights: { ALL_TRANSITIONS:true, ALL_ACTIONS:true }
  };
  runtime(addon).configure().track(mapping);

  var settings = addon.configs['default'];
  ok(settings);
  ok(settings.mappings);
  equal(settings.trackerFun, 'trackerFun');
  equal(settings.trackingNamespace, 'trackingNamespace');
  equal(typeof settings.trackerFactory === 'function');
  equal(typeof settings.tracker === 'object');
  equal(settings.mappings.length, 1);
  ok(settings.mappings[0].insights.get('ALL_TRANSITIONS'));
  ok(settings.mappings[0].insights.get('ALL_ACTIONS'));
});
test('main tracking options', function() {
  var addon    = { configs: [] };
  var settings = {
    trackerFun: 'trackerFun', trackingNamespace: 'trackingNamespace'
  };
  var mapping = {
    insights: { ALL_TRANSITIONS:true, ALL_ACTIONS:true }
  };
  runtime(addon).configure('test', settings).track(mapping);

  settings = addon.configs['test'];
  ok(settings);
  ok(settings.mappings);
  equal(settings.trackerFun, 'trackerFun');
  equal(settings.trackingNamespace, 'trackingNamespace');
  equal(typeof settings.trackerFactory === 'function');
  equal(typeof settings.tracker === 'object');
  equal(settings.mappings.length, 1);
  ok(settings.mappings[0].insights.get('ALL_TRANSITIONS'));
  ok(settings.mappings[0].insights.get('ALL_ACTIONS'));
});
