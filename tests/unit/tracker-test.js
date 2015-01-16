import Ember    from 'ember';
import { test } from 'ember-qunit';
import tracker  from 'ember-insights/tracker';


module('Command prefixed by tracker name');

test('named tracker', function() {
  var command = tracker.trackerPrefixedCommand('customTrack')('send');
  equal(command, 'customTrack.send', 'Computes command for named tracker');
});

test('default tracker', function() {
  var command = tracker.trackerPrefixedCommand()('set');
  equal(command, 'set', 'Computes command for default tracker');
});
