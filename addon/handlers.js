var main = {

  handler: function(settings) {
    return function(type, data, tracker) {
      if (type === 'transition') {
        main.transitionHandler(data, tracker, {
          trackTransitionsAs: settings.trackTransitionsAs
        });
      }
      if (type === 'action') {
        main.actionHandler(data, tracker);
      }
    };
  },

  transitionHandler: function(data, tracker, options) {
    var trackType = options.trackTransitionsAs;

    if (trackType === 'event'    || trackType === 'both') {
      tracker.sendEvent(
        'ember_transition',
        JSON.stringify({ from: data.oldRouteName, to: data.routeName })
      );
    }
    if (trackType === 'pageview' || trackType === 'both') {
      tracker.trackPageView(data.url);
    }
  },

  actionHandler: function(data, tracker) {
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
};


export default {
  main: main
};
