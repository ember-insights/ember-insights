import Ember from 'ember';
import {
  test
} from 'ember-qunit';
import {
  pushToResult,
  getSearchingPaths,
  checkInAll,
  processMatchedGroups
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

test('processes matched groups', function(){
  expect(8);
  var testTracker = {
    set: function(fieldName, fieldValue){
      equal(fieldName, 'location');
      ok(fieldValue);
    }
  };
  var matchedGroups = [{
    keyMatched: 'ALL_TRANSITIONS',
    group: {
      name: 'testName',
      tracker: testTracker,
      handler: function(eventType, eventParams, tracker){
        equal(eventType, 'transition');
        deepEqual(eventParams, { testProperty: 'testValue' });
        deepEqual(tracker, testTracker);
      }
    }}];
  var addonSettings = {
    debug: true,
    updateDocumentLocationOnTransitions: true
  };
  var eventType = 'transition';
  var eventParams = { testProperty: 'testValue' };

  processMatchedGroups(matchedGroups, addonSettings, eventType, eventParams);

  //checks set function that is not fired in case of `updateDocumentLocationOnTransitions` is false
  testTracker.set = function(){ ok(false); };
  addonSettings.updateDocumentLocationOnTransitions = false;

  processMatchedGroups(matchedGroups, addonSettings, eventType, eventParams);
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

test('checks particular event in case of ALL_ACTIONS option', function() {
  ok(false); // is pending
});
