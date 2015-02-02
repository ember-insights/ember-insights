import Ember from 'ember';

function groupMatches(group, routeName, eventType, eventValueToMatch) {
  var routeNameNoIndex = routeName.replace('.index', '');

  var allKey = 'ALL_' + eventType.toUpperCase() + 'S';
  var all = group.insights.getWithDefault(allKey, false);

  if ( checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex) ) {
    return allKey;
  }

  var toMatch = getSearchingPaths(eventType, routeName, routeNameNoIndex, eventValueToMatch);

  for (var i = 0, len = toMatch.length; i < len; i++) {
    var path   = toMatch[i][0];
    var entity = toMatch[i][1];
    if (group.insights.getWithDefault(path, []).indexOf(entity) > -1) {
      return path;
    }
  }

  return false;
}

function getSearchingPaths(eventType, routeName, routeNameNoIndex, eventValueToMatch) {
  if (eventType === 'transition') {
    return [
      ['TRANSITIONS', routeName       ],
      ['TRANSITIONS', routeNameNoIndex],
      ['MAP.' + routeName        + '.ACTIONS', 'TRANSITION'],
      ['MAP.' + routeNameNoIndex + '.ACTIONS', 'TRANSITION']
    ];
  } else if (eventType === 'action') {
    return [
      ['ACTIONS', eventValueToMatch],
      ['MAP.' + routeName        + '.ACTIONS', eventValueToMatch],
      ['MAP.' + routeNameNoIndex + '.ACTIONS', eventValueToMatch]
    ];
  }
}

function getMatchedGroups(groups, routeName, eventType, eventValueToMatch) {
  var result = [];
  for (var i = 0, len = groups.length; i < len; i++) {
    var group = groups[i];
    var keys  = groupMatches(group, routeName, eventType, eventValueToMatch);
    pushToResult(keys, group, result);
  }
  return result;
}

function pushToResult(keyMatched, group, holder) {
  if (keyMatched)
    holder.push({ group: group, keyMatched: keyMatched });
}

function checkInAll(matchAllConfig, eventType, eventValueToMatch, routeNameNoIndex) {
  if (matchAllConfig === true) {
    return true;
  }
  else if (typeof matchAllConfig === 'object' && matchAllConfig.except) {
    var listOfExcepted = matchAllConfig.except;
    var valuesToMatch = [ eventValueToMatch ];
    if (eventType === 'transition' && routeNameNoIndex !== eventValueToMatch) {
      valuesToMatch.push(routeNameNoIndex);
    }

    if (Ember.EnumerableUtils.intersection(valuesToMatch, listOfExcepted).length === 0) {
      return true;
    }
  }
  return false;
}

function processMatchedGroups(matchedGroups, addonSettings, eventType, eventParams){
    for (var i = 0, len = matchedGroups.length; i < len; i++) {
      var matchedGroup = matchedGroups[i].group;
      var matchedKey   = matchedGroups[i].keyMatched;

      // drop a line to the developer console
      if (addonSettings.debug) {
        Ember.debug("TRAP: ---- MATCHED key '" + matchedKey + "' in group '" + matchedGroup.name + "'");
      }

      if (eventType === 'transition' && addonSettings.updateDocumentLocationOnTransitions)
        matchedGroup.tracker.set('location', document.URL);
      // handle particular (matched) insight
      matchedGroup.handler(eventType, eventParams, matchedGroup.tracker);
    }
}

export {
  getMatchedGroups,
  processMatchedGroups,
  pushToResult,
  getSearchingPaths,
  checkInAll
};
