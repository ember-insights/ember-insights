import Ember from 'ember';
import GoogleAnalyticInsights from 'ember-insights/lib/index';

export default {

  name: 'Google Analytics insights',

  initialize: function (container, application) {
    GoogleAnalyticInsights.configure('staging', {
      debug: true,
      gaGlobalFuncName: 'ga',
      insights: {
        transitions: ['outer.inner'],
        actions: ['testAction1'],
        map: {
          outer: {
            inner: {
              actions: ['transition', 'testAction2']
            }
          }
        }
      }
    });

    var insights = Ember.Object.create();
    insights.set('default', GoogleAnalyticInsights.start('staging'));

    container.optionsForType('globals', {instantiate: false, singleton: true});
    container.register('globals:insights', insights);
    container.typeInjection('controller', 'insights', 'globals:insights');
    container.typeInjection('route', 'insights', 'globals:insights');
  }
};
