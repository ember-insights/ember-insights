import ENV                  from '../config/environment';
import EmberInsights        from 'ember-insights';
import EmberInsightsMapping from './../config/ember-insights';

export default {

  name: 'ember-insights',

  initialize: function(/*container, application*/) {
    EmberInsights.configure('development', {
      // Pushes messages into console log.
      debug: true,
      // Factory that provides tracker instance.
      trackerFactory: EmberInsights.ConsoleTracker.factory,
      // Defines how to track transitions (available options are 'pageview', 'event').
      //trackTransitionsAs: 'pageview',
      // Sets application fields.
      //fields: { appName: 'appName', appId: 'appId', appVersion: 'appVersion'},
    }).track(
      EmberInsightsMapping.development
    );

    if (ENV.environment === 'development') {
      // Starts catching insights and return spicified tracker as an instance.
      // You can manually suspend and resume catching with 'start'/'stop' functions
      // any time during application runtime.
      EmberInsights.start(ENV.environment);
    }
  }

};
