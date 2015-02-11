import Ember    from 'ember';
import ENV      from '../config/environment'
import Insights from 'ember-insights';
import InsightsMappings from './../config/ember-insights';

export default {

  name: 'basic insights setup',

  initialize: function (container, application) {
    Insights.configure('development', {
      debug: true,
      trackerFactory: Insights.ConsoleTracker.factory
    }).track(InsightsMappings.development);

    if (ENV.environment === 'development') {
      Insights.start('development');
    }
  }

};
