function transitionHandler(data, tracker, settings) {
  switch (settings.trackTransitionsAs) {
    case 'event':
      tracker.sendEvent('transition', data.routeName, data.prevRouteName);
      break;
    case 'pageview':
      tracker.trackPageView(data.url);
      break;
  }
}

function actionHandler(data, tracker) {
  let actionLabel = data.actionArguments[0];
  let actionValue = data.actionArguments[1];

  tracker.sendEvent('action', data.actionName, actionLabel, actionValue);
}


export default {
  factory: (settings) => {
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
