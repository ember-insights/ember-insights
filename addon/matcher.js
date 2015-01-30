import Ember from 'ember';

function groupMatches(group, routeName, eventType, eventValueToMatch) {
  var routeNameNoIndex = routeName.replace('.index', '');

  var matchAllKey = 'ALL_' + eventType.toUpperCase() + 'S';
  var matchAllConfig = group.insights.getWithDefault(matchAllKey, false);

  if (matchAllConfig === true) {
    return matchAllKey;
  }
  else if (typeof matchAllConfig === 'object' && matchAllConfig.except) {
    var listOfExcepted = matchAllConfig.except;
    var valuesToMatch = [ eventValueToMatch ];
    if (eventType === 'transition' && routeNameNoIndex !== routeName) {
      valuesToMatch.push(routeNameNoIndex);
    }

    if (Ember.EnumerableUtils.intersection(valuesToMatch, listOfExcepted).length === 0) {
      return matchAllKey;
    }
  }

  var toMatch;
  if (eventType === 'transition') {
    toMatch = [
      ['TRANSITIONS', routeName       ],
      ['TRANSITIONS', routeNameNoIndex],
      ['MAP.' + routeName        + '.ACTIONS', 'TRANSITION'],
      ['MAP.' + routeNameNoIndex + '.ACTIONS', 'TRANSITION']
    ];
  } else if (eventType === 'action') {
    toMatch = [
      ['ACTIONS', eventValueToMatch],
      ['MAP.' + routeName        + '.ACTIONS', eventValueToMatch],
      ['MAP.' + routeNameNoIndex + '.ACTIONS', eventValueToMatch]
    ];
  }

  for (var i = 0, len = toMatch.length; i < len; i++) {
    var path   = toMatch[i][0];
    var entity = toMatch[i][1];
    if (group.insights.getWithDefault(path, []).indexOf(entity) > -1) {
      return path;
    }
  }

  return false;
}

function getMatchedGroups(groups, routeName, eventType, eventValueToMatch) {
  var matches = [];
  for (var i = 0, len = groups.length; i < len; i++) {
    var group = groups[i];
    var keyMatched = groupMatches(group, routeName, eventType, eventValueToMatch);
    pushIfMatches(keyMatched, group, matches);
  }
  return matches;
}

function pushIfMatches(keyMatched, group, matches) {
  if (keyMatched) {
    matches.push({
      group: group,
      keyMatched: keyMatched
    });
  }
}

export {
  getMatchedGroups,
  pushIfMatches
};
