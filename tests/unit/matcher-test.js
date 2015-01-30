import Ember from 'ember';
import {
  test
} from 'ember-qunit';
import {
  pushIfMatches,
  getEventDefinitions,
  findInMatchAllConfig
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

test('match all config', function() {
  var eventType = 'transition';
  var eventValueToMatch = 'published.index';
  var routeNameNoIndex = 'published';
  var matchAllKey = 'ALL_TRANSITIONS';

  var res, matchAllConfig;

  // matchAllConfig is not found or is set to false
  matchAllConfig = false;
  res = findInMatchAllConfig(matchAllConfig, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, false);

  // matchAllConfig is set to true
  matchAllConfig = true;
  res = findInMatchAllConfig(matchAllConfig, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, true);

  // matchAllConfig has except value
  matchAllConfig = { except: ['main'] };
  res = findInMatchAllConfig(matchAllConfig, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, true);

  // matchAllConfig has except values
  matchAllConfig = { except: ['index', 'published'] };
  res = findInMatchAllConfig(matchAllConfig, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, false);

  // current event value is excepted
  matchAllConfig = { except: ['published'] };
  res = findInMatchAllConfig(matchAllConfig, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, false);

  // matchAllConfig has except value
  eventValueToMatch = 'main';
  routeNameNoIndex = 'main';
  matchAllConfig = { except: ['published'] };
  res = findInMatchAllConfig(matchAllConfig, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, true);

});
