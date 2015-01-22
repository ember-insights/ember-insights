import Ember    from 'ember';
import { test } from 'ember-qunit';
import tracker  from 'ember-insights/tracker';


module('Tracker');

test('tracking namespace', function() {
  var command = tracker.trackingNamespace('namespace')('send');
  equal(command, 'namespace.send');
});

test('w/ out predefined namespace', function() {
  var command = tracker.trackingNamespace()('set');
  equal(command, 'set');

  command = tracker.trackingNamespace('')('set');
  equal(command, 'set');
});

test('tracker function as a global property', function() {
  var actual   = tracker.trackerFun('global', { global: true });
  ok(actual);
});

test('tracker function as a custom function', function() {
  var expected = function() {};
  var actual   = tracker.trackerFun(expected);
  equal(actual, expected);
});
