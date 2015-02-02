import Ember from 'ember';
import {
  test
} from 'ember-qunit';
import {
  pushToResult,
  getSearchingPaths,
  checkInAll
} from 'ember-insights/matcher';


module('Matcher');

test('adds mached groups to searching result', function() {
  var holder;

  // match found
  holder = [];
  pushToResult(true, 'group', holder);
  deepEqual(holder, [{ group: 'group', keyMatched: true }]);

  // match not found
  holder = [];
  pushToResult(false, 'group', holder);
  deepEqual(holder, []);
});

test('returns an array of searching paths', function() {
  var eventType = 'transition';
  var routeName = 'mainpage.index';
  var routeNameNoIndex = 'mainpage';
  var eventValueToMatch = 'mainpage.index';

  //In case of Transition
  var paths = getSearchingPaths(eventType,routeName,routeNameNoIndex,eventValueToMatch);
  deepEqual(paths, [
    ['TRANSITIONS', routeName       ],
    ['TRANSITIONS', routeNameNoIndex],
    ['MAP.' + routeName        + '.ACTIONS', 'TRANSITION'],
    ['MAP.' + routeNameNoIndex + '.ACTIONS', 'TRANSITION']
  ]);

  eventType = 'action';
  eventValueToMatch = '_bestGAEver';

  //In case of Action
  paths = getSearchingPaths(eventType,routeName,routeNameNoIndex,eventValueToMatch);
  deepEqual(paths, [
    ['ACTIONS', eventValueToMatch],
    ['MAP.' + routeName        + '.ACTIONS', eventValueToMatch],
    ['MAP.' + routeNameNoIndex + '.ACTIONS', eventValueToMatch]
  ]);

});

test('checks particular event in case of ALL_TRANSITIONS option', function() {
  var eventType         = 'transition';
  var eventValueToMatch = 'published.index';
  var routeNameNoIndex  = 'published';

  var res, all;

  all = false;
  res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, false);

  all = true;
  res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, true);

  all = { except: ['main'] };
  res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, true);

  all = { except: ['index', 'published'] };
  res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, false);

  all = { except: ['published'] };
  res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, false);

  eventValueToMatch = 'main';
  routeNameNoIndex  = 'main';
  all = { except: ['published'] };
  res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
  equal(res, true);
});
