import Ember from 'ember';
import {
  test
} from 'ember-qunit';
import {
  pushIfMatches,
  getEventDefinitions
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

test('should return array of definitions to match by type', function() {
  var eventType = 'transition';
  var routeName = 'mainpage.index';
  var routeNameNoIndex = 'mainpage';
  var eventValueToMatch = 'mainpage.index';
  //Transition test
  var result = getEventDefinitions(eventType,routeName,routeNameNoIndex,eventValueToMatch);
  deepEqual(result, [
    ['TRANSITIONS', routeName       ],
    ['TRANSITIONS', routeNameNoIndex],
    ['MAP.' + routeName        + '.ACTIONS', 'TRANSITION'],
    ['MAP.' + routeNameNoIndex + '.ACTIONS', 'TRANSITION']
  ]);

  eventType = 'action';
  eventValueToMatch = '_bestGAEver';
  //Action test
  result = getEventDefinitions(eventType,routeName,routeNameNoIndex,eventValueToMatch);
  deepEqual(result, [
    ['ACTIONS', eventValueToMatch],
    ['MAP.' + routeName        + '.ACTIONS', eventValueToMatch],
    ['MAP.' + routeNameNoIndex + '.ACTIONS', eventValueToMatch]
  ]);

});
