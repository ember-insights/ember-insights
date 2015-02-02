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

test('setFields function', function() {
  expect(6);
  var _tracker = function(nmspace, propName, propVal) {
    equal(nmspace, 'forTracker');
    ok(
      (propName === 'appName'          && propVal === 'My Appp !') ||
      (propName === 'screenResolution' && propVal === '999x600'  )
    );
  };
  var _namespace = function(commandName) {
    equal(commandName, 'set');
    return 'forTracker';
  };
  var fields = {
    appName: 'My Appp !',
    screenResolution: '999x600'
  };

  GoogleTracker.setFields(_tracker, _namespace, fields);
});
