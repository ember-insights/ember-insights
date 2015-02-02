import Ember              from 'ember';
import { test }           from 'ember-qunit';
import { GoogleTracker }  from 'ember-insights/trackers';


module('Tracker');

test('tracking namespace', function() {
  var command = GoogleTracker.trackingNamespace('namespace')('send');
  equal(command, 'namespace.send');
});

test('w/ out predefined namespace', function() {
  var command = GoogleTracker.trackingNamespace()('set');
  equal(command, 'set');

  command = GoogleTracker.trackingNamespace('')('set');
  equal(command, 'set');
});

test('tracker function as a global property', function() {
  var actual   = GoogleTracker.trackerFun('global', { global: true });
  ok(actual);
});

test('tracker function as a custom function', function() {
  var expected = function() {};
  var actual   = GoogleTracker.trackerFun(expected);
  equal(actual, expected);
});
