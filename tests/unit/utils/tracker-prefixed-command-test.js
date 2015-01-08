import Ember    from 'ember';
import { test } from 'ember-qunit';

import Utils from 'ember-insights/lib/utils';

module('Command prefixed by tracker name');

test('named tracker', function() {
  expect(1);
  var command, options = {};

  options.trackerName = 'customTrack';
  command = Utils.trackerPrefixedCommand('send', options);
  equal(command, 'customTrack.send', 'Computes command for named tracker');
});

test('default tracker', function() {
  expect(1);
  var command, options = {};

  command = Utils.trackerPrefixedCommand('set', options);
  equal(command, 'set', 'Computes command for default tracker');
});
