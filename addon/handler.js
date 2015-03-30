import InsightsHandler from './insights-handler';

export default {
  factory: function(settings) {
    var insightsHandler = InsightsHandler.factory(settings);

    function defaultDispatcher(type, data, tracker) {
      insightsHandler(type, data, tracker);
    }

    return defaultDispatcher;
  }
};
