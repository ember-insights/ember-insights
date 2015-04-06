import InsightsHandler from './insights-handler';

export default {
  factory: (settings) => {
    let insightsHandler = InsightsHandler.factory(settings);

    function defaultDispatcher(type, data, tracker) {
      insightsHandler(type, data, tracker);
    }

    return defaultDispatcher;
  }
};
