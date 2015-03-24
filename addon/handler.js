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
    function defaultDispatcher(type, data, tracker) {
      switch(type) {
        case 'transition':
          transitionHandler(data, tracker, settings);
          break;
        case 'action':
          actionHandler(data, tracker, settings);
          break;
      }
    }

    return defaultDispatcher;
  },

  transitionHandler: transitionHandler,
  actionHandler: actionHandler
};
