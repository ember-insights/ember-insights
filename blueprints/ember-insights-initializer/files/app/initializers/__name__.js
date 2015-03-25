import ENV                  from '../config/environment';
import EmberInsights        from 'ember-insights';
import EmberInsightsMapping from './../config/ember-insights';

export default {

  name: 'ember-insights',

  initialize: function(/*container, application*/) {
    EmberInsights.configure('development', {
      // Pushes messages into `Ember.debug`, sets 'true' by default.
      // debug: false,
      // Defines how to track transitions (available options are 'pageview' and 'event'), uses a 'pageview' by default.
      // trackTransitionsAs: 'event',
      // Sets environment specific tracker, uses an 'EmberInsights.ConsoleTracker' by default.
      // trackerFactory: EmberInsights.GoogleTracker.with({
      //   // Sets custom tracker object (available options are 'string' or 'function'), uses a 'ga' object by default.
      //   // trackerFun: '_ga',
      //   // Sets custom tracker name.
      //   //name: 'newTracker',
      //   // Sets application specific fields.
      //   //fields: { appName: 'appName', appId: 'appId', appVersion: 'appVersion' }
      // })
    }).track(
      EmberInsightsMapping.development
    );

    if (ENV.environment === 'development') {
      // Starts catching insights and return specified tracker as an instance.
      // You can manually suspend and resume catching with 'start'/'stop' functions
      // any time during application runtime.
      EmberInsights.start(ENV.environment);
    }
  }

};
