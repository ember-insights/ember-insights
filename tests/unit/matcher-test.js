import Ember from 'ember';
import {
  it
} from 'ember-mocha';
import {
  pushToResult,
  getSearchingPaths,
  checkInAll,
  processMatchedGroups
} from 'ember-insights/matcher';


describe('Matcher', function(){

  it('adds mached groups to searching result', function(){
    var holder;

    // match found
    holder = [];
    pushToResult(true, 'group', holder);
    expect(holder).to.deep.equal([{ group: 'group', keyMatched: true }]);

    // match not found
    holder = [];
    pushToResult(false, 'group', holder);
    expect(holder).to.deep.equal([]);
  });

  it('returns an array of searching paths', function() {
    var eventType = 'transition';
    var routeName = 'mainpage.index';
    var routeNameNoIndex = 'mainpage';
    var eventValueToMatch = 'mainpage.index';
    var paths;

    //In case of Transition
    paths = getSearchingPaths(eventType,routeName,routeNameNoIndex,eventValueToMatch);
    expect(paths).to.deep.equal([
      ['TRANSITIONS', routeName       ],
      ['TRANSITIONS', routeNameNoIndex],
      ['MAP.' + routeName        + '.ACTIONS', 'TRANSITION'],
      ['MAP.' + routeNameNoIndex + '.ACTIONS', 'TRANSITION']
    ]);

    //In case of Action
    eventType = 'action';
    eventValueToMatch = '_bestGAEver';
    paths = getSearchingPaths(eventType,routeName,routeNameNoIndex,eventValueToMatch);
    expect(paths).to.deep.equal([
      ['ACTIONS', eventValueToMatch],
      ['MAP.' + routeName        + '.ACTIONS', eventValueToMatch],
      ['MAP.' + routeNameNoIndex + '.ACTIONS', eventValueToMatch]
    ]);
  });

  describe('processes matched groups', function() {
    var testTracker, matchedGroups, addonSettings, eventType, eventParams;

    beforeEach(function() {
      testTracker = {
        set: function() {}
      };
      matchedGroups = [{
        keyMatched: 'ALL_TRANSITIONS',
        group: {
          name: 'testName',
          tracker: testTracker,
          handler: function() {}
        }
      }];
      addonSettings = { debug: true };
      eventType = 'transition';
      eventParams = { testProperty: 'testValue' };
    });

    it('invokes handler', function(done) {
      matchedGroups[0].group.handler = function(eventType, eventParams, tracker) {
        expect(eventType).to.equal('transition');
        expect(eventParams).to.deep.equal({ testProperty: 'testValue' });
        expect(tracker).to.deep.equal(testTracker);
        done();
      };
      processMatchedGroups(matchedGroups, addonSettings, eventType, eventParams);
    });

    it('sets location if configured', function(done) {
      addonSettings.updateDocumentLocationOnTransitions = true;
      testTracker.set = function(fieldName, fieldValue) {
        expect(fieldName).to.equal('location');
        expect(fieldValue).to.be.ok();
        done();
      };
      processMatchedGroups(matchedGroups, addonSettings, eventType, eventParams);
    });

    it('does not set location if not configured', function() {
      // checks that set method is not fired in case of `updateDocumentLocationOnTransitions` is false
      addonSettings.updateDocumentLocationOnTransitions = false;
      testTracker.set = function() {
        expect(false).to.be.ok();
      };
      processMatchedGroups(matchedGroups, addonSettings, eventType, eventParams);
    });
  });

  it('checks particular event in case of ALL_TRANSITIONS option', function() {
    var eventType         = 'transition';
    var eventValueToMatch = 'published.index';
    var routeNameNoIndex  = 'published';

    var res, all;

    all = false;
    res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
    expect(res).to.equal(false);

    all = true;
    res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
    expect(res).to.equal(true);

    all = { except: ['main'] };
    res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
    expect(res).to.equal(true);

    all = { except: ['index', 'published'] };
    res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
    expect(res).to.equal(false);

    all = { except: ['published'] };
    res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
    expect(res).to.equal(false);

    eventValueToMatch = 'main';
    routeNameNoIndex  = 'main';
    all = { except: ['published'] };
    res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
    expect(res).to.equal(true);
  });

  it('checks particular event in case of ALL_ACTIONS option', function() {
    var routeNameNoIndex  = 'published';
    var res, all;
    var eventType = 'action';
    var eventValueToMatch = 'testAction';

    all = true;
    res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
    expect(res).to.equal(true);

    all = false;
    res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
    expect(res).to.equal(false);

    all = { except: ['testAction']};
    res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
    expect(res).to.equal(false);

    all = { except: ['testAction1']};
    res = checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex);
    expect(res).to.equal(true);
  });

});
