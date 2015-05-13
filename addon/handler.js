import InsightsHandler from './handlers/insights';
import TimingHandler   from './handlers/timing';

export default {
  factory: (settings) => {
    let insightsHandler = InsightsHandler.factory(settings);
    return (type, data, tracker) => {
      insightsHandler(type, data, tracker);
    };
  },
  proxy: (dispatch, settings) => {
    let timing = new TimingHandler(settings);
    return (type, data, tracker) => {
      dispatch(type, data, tracker);
      timing.handle(type, data, tracker);
    };
  }
};
