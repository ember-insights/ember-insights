import Ember    from 'ember';
import Insights from 'ember-insights';
import AlertTracker from 'dummy/lib/alert_tracker';

export default {

  name: 'Console tracker insights',

  initialize: function (container, application) {

    Insights.configure('development', {
      // trackerFactory: AlertTracker.factory
      trackerFactory: Insights.ConsoleTracker.factory
      // trackerFactory: Insights.GoogleTracker.factory
      // trackerFactory: Insights.GoogleTracker.with({
      //   trackerFun: 'ga', name: '', fields: {appName: 'dummy'}
      // })

    }).track({
      timing: {transitions:true},
      insights: {
        ALL_TRANSITIONS: {
          except: ['index', 'main.record', 'outer', 'outer.inner', 'outer.inner.nested']
        },
        TRANSITIONS: ['index', 'outer.inner.nested'],
        ACTIONS: ['a1'],
        MAP: {
          outer: {
            ACTIONS: ['TRANSITION', 'a2'],
            inner: {
              ACTIONS: ['TRANSITION', 'a2', 'a3']
            }
          }
        }
      },
      // dispatch: function(eventType, context, tracker) {
      //   console.log('Gotcha!');
      // }
    });
    Insights.start('development');
  }
};
