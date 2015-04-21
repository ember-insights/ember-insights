import ENV                  from '../config/environment';
import EmberInsights        from 'ember-insights';
import EmberInsightsMapping from './../config/ember-insights';

export default {

  name: 'ember-insights',

  initialize: function(/*container, application*/) {
    EmberInsights.configure({
      'development': { debug:true },
      // 'production': {
        // Pushes messages into `Ember.debug`, sets 'true' by default.
        // debug: false,
        // Defines how to track transitions (available options are 'pageview' and 'event'), uses a 'pageview' by default.
        // trackTransitionsAs: 'event',
        // Sets environment-specific tracker, uses an 'EmberInsights.ConsoleTracker' by default.
        // trackerFactory: EmberInsights.GoogleTracker.with({
        //   // Sets custom tracker object (available options are 'string' or 'function'), uses a 'ga' object by default.
        //   // trackerFun: '_ga',
        //   // Sets custom tracker name.
        //   //name: 'newTracker'
        // })
      // }
    }).track(
      EmberInsightsMapping.application
    );

    EmberInsights.start(ENV.environment);
  }

};
