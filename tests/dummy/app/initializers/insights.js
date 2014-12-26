import Ember from 'ember';
import GoogleAnalyticInsights from 'ember-insights/lib/index';

export default {

  name: 'Google Analytics insights',

  initialize: function (container, application) {
    var Insights = GoogleAnalyticInsights;

    Insights.configure('staging', {
      debug: true,
      gaGlobalFuncName: 'ga',
      gaTrackerName: 'customTracker'
    });

    Insights.addGroup('staging', {
      name: 'first',
      insights: {
        transitions: ['index'],
        actions: ['testAction1'],
        map: {
          outer: {
            actions: ['transition'],
            inner: {
              actions: ['transition', 'testAction2']
            }
          }
        }
      }
    });

    Insights.addGroup('staging', {
      name: 'experiment2',
      insights: {
        map: {
          outer: {
            actions: ['testAction2']
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
        transitions: ['main.record'],
      },
      // example of custom handler for matched events
      handler: function(type, options, addonUtils) {
        if (type !== 'transition') {
          // Something is wrong! This group is for transitions only!
          return;
        }

        var action;
        var model = options.route.get('controller.model');
        action = options.routeName + " (record #" + model.get('recordData') + ")";

        // pass matched event to Google Analytic service
        addonUtils.sendEvent(type, action);
      }
    });

  }
};
