import Ember from 'ember';
import {
  test
} from 'ember-qunit';
import {
  pushIfMatches
} from 'ember-insights/matcher';


module('Matcher');

test('should push only matching groups to matches array', function() {
  var matches;

  // match found
  matches = ['stub'];
  pushIfMatches('testKey', 'grp', matches);
  deepEqual(
    matches,
    ['stub', { group: 'grp', keyMatched: 'testKey' }],
    'mathed group pushed to array'
  );

  // match not found
  matches = ['stub'];
  pushIfMatches(false, 'grp2', matches);
  deepEqual(matches, ['stub'], 'not mathed group not pushed to array');
});
