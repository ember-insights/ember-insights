_Hey, listen! This is alpha-level software with incomplete features and planned future changes. Users's metrics are extensive, and not trivial to implement. `ember-insights.js` is heavily based on Google Analytics._

[![Build Status](https://travis-ci.org/ember-insights/ember-insights.svg?branch=master)](https://travis-ci.org/ember-insights/ember-insights) [![Ember Observer Score](http://emberobserver.com/badges/ember-insights.svg)](http://emberobserver.com/addons/ember-insights)

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
      // Pushes messages into `Ember.debug`.
      //debug: false,
      // Factory that provides tracker instance.
      trackerFactory: EmberInsights.ConsoleTracker.factory
    }).track({
      insights: { ALL_TRANSITIONS: true, ALL_ACTIONS: true }
    });

    EmberInsights.configure('production', {
      // Factory that provides tracker instance.
      trackerFactory: EmberInsights.GoogleTracker.factory,
      // Defines how to track transitions (available options are 'pageview', 'event').
      trackTransitionsAs: 'pageview',
      // Sets application fields.
      fields: { appName: 'appName', appId: 'appId', appVersion: 'appVersion'}
    }).track({
      insights: { ALL_TRANSITIONS: true, ALL_ACTIONS: true }
    });

    // Starts catching insights and return specified tracker as an instance.
    // You can manually suspend and resume catching with 'start'/'stop' functions
    // any time during application runtime.
    EmberInsights.start(ENV.environment);
  }
};
```

In additional, there is available an AMD module and Bower component, find more details here [ember-insights.amd.js](https://github.com/ember-insights/ember-insights.amd.js).

## Live demo

The easiest way to find out more details is checking [live demo](http://ember-insights.github.io/#example-component) and their sources.

## Ask for help

Check out the [wiki](https://github.com/ember-insights/ember-insights/wiki). If you feel like porting or fixing something, please drop a [pull request](https://github.com/ember-insights/ember-insights/pulls) or [issue tracker](https://github.com/ember-insights/ember-insights/issues) at GitHub! I believe that with the help of everyone we can bring this to Ember in a modular and robust way.

## Acknowledgement

Product of Roundscope Ukraine LLC. HEAD is https://github.com/ember-insights/ember-insights. Based on https://github.com/roundscope/web-engineering mastery.
