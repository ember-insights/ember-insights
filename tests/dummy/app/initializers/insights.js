import Ember    from 'ember';
import Insights from 'ember-insights';

export default {

  name: 'Console tracker insights',

  initialize: function (container, application) {

    Insights.configure('development', {
      debug: true,
      trackerFactory: Insights.ConsoleTracker.factory
    }).track({
      insights: {
        ALL_TRANSITIONS: {
          except: ['index', 'main.record', 'outer', 'outer.inner', 'outer.inner.nested']
        },
        TRANSITIONS: ['index', 'outer.inner.nested'],
        ACTIONS: ['testAction1'],
        MAP: {
          outer: {
            ACTIONS: ['TRANSITION', 'testAction2'],
            inner: {
              ACTIONS: ['TRANSITION', 'testAction2', 'testAction3']
            }
          }
        }
      }
    });
    Insights.start('development');
  }
};
