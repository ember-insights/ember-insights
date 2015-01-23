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
  equal(mapping.trackerFun, 'ga');
  equal(settings.trackingNamespace, '');
  ok(typeof mapping.trackerFactory === 'function');
  ok(typeof mapping.tracker === 'object');
  equal(settings.mappings.length, 1);
  ok(mapping.insights.get('ALL_TRANSITIONS'));
  ok(mapping.insights.get('ALL_ACTIONS'));
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
  equal(mapping.trackerFun, 'trackerFun');
  equal(mapping.trackingNamespace, 'trackingNamespace');
  ok(typeof mapping.trackerFactory === 'function');
  ok(typeof mapping.tracker === 'object');
  equal(settings.mappings.length, 1);
  ok(mapping.insights.get('ALL_TRANSITIONS'));
  ok(mapping.insights.get('ALL_ACTIONS'));
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
  equal(mapping.trackerFun, 'trackerFun');
  equal(mapping.trackingNamespace, 'trackingNamespace');
  ok(typeof mapping.trackerFactory === 'function');
  ok(typeof mapping.tracker === 'object');
  equal(settings.mappings.length, 1);
  ok(mapping.insights.get('ALL_TRANSITIONS'));
  ok(mapping.insights.get('ALL_ACTIONS'));
});
