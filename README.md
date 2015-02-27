_Hey, listen! This is alpha-level software with incomplete features and planned future changes. Use at your own risk, expect some instability, disruption and source-level incompatibility for a while yet._

[![Build Status](https://travis-ci.org/ember-insights/ember-insights.svg?branch=master)](https://travis-ci.org/ember-insights/ember-insights)

## Getting started

`$` `ember install:addon ember-insights`

Use blueprint for generating configs and initializer.

`$` `ember generate ember-insights-initializer ember-insights`

Or you could manually drop an initializer.

```javascript
import ENV           from '../config/environment'
import EmberInsights from 'ember-insights';

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
    }).track({
      insights: { ALL_TRANSITIONS: true, ALL_ACTIONS: true }
    });

    if (ENV.environment === 'development') {
      // Starts catching insights and return specified tracker as an instance.
      // You can manually suspend and resume catching with 'start'/'stop' functions
      // any time during application runtime.
      EmberInsights.start(ENV.environment);
    }
  }

};

```

In additional, there is available an AMD module and Bower component, find more details here [ember-insights.amd.js](https://github.com/ember-insights/ember-insights.amd.js)


## Acknowledgement

Product of Roundscope Ukraine LLC. HEAD is https://github.com/ember-insights/ember-insights. Based on https://github.com/roundscope/web-engineering mastery.
