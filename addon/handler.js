function transitionHandler(data, tracker, settings) {
  switch (settings.trackTransitionsAs) {
    case 'event':
      tracker.sendEvent(
        'transition', JSON.stringify({ from: data.oldRouteName, to: data.routeName })
      );
      break;
    case 'pageview':
      tracker.trackPageView(data.url);
      break;
  }
}

function actionHandler(data, tracker, settings) {
  settings = settings || {};
  var args = ['action', data.actionName];

  var actionLabel = data.actionArguments[0];
  var actionValue = data.actionArguments[1];

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
