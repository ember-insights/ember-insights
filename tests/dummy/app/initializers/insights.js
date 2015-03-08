import Ember    from 'ember';
import Insights from 'ember-insights';

export default {

  name: 'Console tracker insights',

  initialize: function (container, application) {

    Insights.configure('development', {
      // trackerFactory: Insights.ConsoleTracker.factory

      // trackerFactory: Insights.GoogleTracker.factory
      // trackerFactory: Insights.GoogleTracker.with({
      //   trackerFun: 'ga', name: ''
      // })

      // timings: [
      //   {
      //     start: 't:index',
      //     end: 'a:a2',
      //     points: ['t:outer', 'a:a1']
      //   }
      // ]
    }).track({
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

      // timings: [
      //   {
      //     title: 'Chain 2',
      //     start: 't:outer.inner',
      //     end: 'a:a2'
      //   }
      // ],
      // timingHandler: function(measureName, tracker, data) {
      //   console.log('New timing in custom track!');
      // }
    });
    Insights.start('development');
  }
};
