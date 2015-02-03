function transitionHandler(data, tracker, settings) {
  var trackType = settings.trackTransitionsAs;

  if (trackType === 'event'    || trackType === 'both') {
    tracker.sendEvent(
      'ember_transition',
      JSON.stringify({ from: data.oldRouteName, to: data.routeName })
    );
  }
  if (trackType === 'pageview' || trackType === 'both') {
    tracker.trackPageView(data.url);
  }
}

function actionHandler(data, tracker, settings) {
  settings = settings || {}; // TODO: currenly this line is needed only to fix JSHint error. Is there reasons to add 'settings' to arguments list?
  var args = ['ember_action', data.actionName];
  var actionLabel = data.actionArguments[0],
  actionValue = data.actionArguments[1];

  if (actionLabel != null) {
    args[2] = actionLabel;
    if (actionValue != null) {
      args[3] = actionValue;
    }
  }

  tracker.sendEvent.apply(tracker, args);
}


export default {
  factory: function(settings) {
    var handler = function(type, data, tracker) {
      if (type === 'transition') {
        transitionHandler(data, tracker, settings);
      }

      if (type === 'action') {
        actionHandler(data, tracker, settings);
      }
    };

    return handler;
  },

  transitionHandler: transitionHandler,
  actionHandler: actionHandler
};
