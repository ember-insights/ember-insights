import Ember    from 'ember';
import Insights from 'ember-insights';

export default {

  name: 'Google Analytics insights',

  initialize: function (container, application) {

    Insights.configure('staging', {
      debug: true,
      // gaGlobalFuncName: 'ga',
      // gaTrackerName: 'customTracker',
      trackTransitionsAs: 'pageview', // 'pageview' (default) OR 'event' OR 'both'
      // updateDocumentLocationOnTransitions: true
    });

    Insights.addGroup('staging', {
      name: 'first',
      insights: {
        // ALL_TRANSITIONS: true,
        ALL_TRANSITIONS: {
          except: ['index', 'main.record', 'outer', 'outer.inner', 'outer.inner.nested']
        },
        TRANSITIONS: ['index', 'outer.inner.nested'],
        // ALL_ACTIONS: true,
        // ALL_ACTIONS: { except: ['testAction2'] },
        ACTIONS: ['testAction1'],
        MAP: {
          outer: {
            ACTIONS: ['TRANSITION'],
            inner: {
              ACTIONS: ['TRANSITION', 'testAction2', 'testAction3']
            }
          }
        }
      }
    });

    Insights.addGroup('staging', {
      name: 'experiment2',
      insights: {
        MAP: {
          outer: {
            ACTIONS: ['testAction2']
          }
        }
      }
    });

    var insights = Ember.Object.create();
    insights.set('default', Insights.start('staging'));

    container.optionsForType('globals', {instantiate: false, singleton: true});
    container.register('globals:insights', insights);
    container.typeInjection('controller', 'insights', 'globals:insights');
    container.typeInjection('route', 'insights', 'globals:insights');

    // You can remove any added group!
    Insights.removeGroup('staging', 'experiment2'); // do not track 'testAction2' action on 'outer' route

    Insights.addGroup('staging', {
      name: 'forMainRecords',
      insights: {
        TRANSITIONS: ['main.record'],
      },
      // example of custom handler for matched events
      handler: function(type, options, tracker) {
        if (type !== 'transition') {
          // Something is wrong! This group is for transitions only!
          return;
        }

        var action;
        var model = options.route.get('controller.model');
        action = options.routeName + " (record #" + model.get('recordData') + ")";

        // pass matched event to Google Analytic service
        tracker.sendEvent(type, action);
      }
    });

  }
};
