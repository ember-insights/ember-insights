_Hey, listen! This is alpha-level software with incomplete features and planned future changes. Use at your own risk, expect some instability, disruption and source-level incompatibility for a while yet._

[![Build Status](https://travis-ci.org/roundscope/ember-insights.svg?branch=master)](https://travis-ci.org/roundscope/ember-insights)

## Getting started Ember-CLI addon

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
      // Starts catching insights and return spicified tracker as an instance.
      // You can manually suspend and resume catching with 'start'/'stop' functions
      // any time during application runtime.
      EmberInsights.start(ENV.environment);
    }
  }

};

```

### Setup Google Analytics snippet

To setup Google Universal Analytics, you have to create `analyticsInsights` key in your
configuration environment.js:

```javascript
var ENV = {
  analyticsInsights: {
    trackers: {
      googleAnalytics: {
        webPropertyId: '<id of your web property>',
        linkid: false, // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#enhancedlink
        displayFeatures: false // https://developers.google.com/analytics/devguides/collection/analyticsjs/display-features
      }
    }
  }
}
```

Also check, that you have `{{content-for 'head'}}` in your index.html.

## Tracker object
Call to `Insights.start` method returns object containing utility functions:

#### Tracker.send(fieldNameObj)
Calls `gaGlobalFunction('customTrackerName.send', fieldNameObj);` where `gaGlobalFunction` is the name of Google Analytics' global function (default - `window.ga`) and prefix `customTrackerName.` is only present if `'gaTrackerName': 'customTrackerName'` was passed to configuration object.

#### Tracker.sendEvent(category, action, label, value)
Calls `gaGlobalFunction('customTrackerName.send', fieldNameObj);` where `gaGlobalFunction` - GA's global function, `customTrackerName` - custom name of tracker (if present) and `fieldNameObj` - following object (eventLabel and eventValue may not be added to object):
```javascript
{
  'hitType':       'event',  // Required
  'eventCategory': category, // Required
  'eventAction':   action,   // Required
  'eventLabel':    label,    // Added only if label is present
  'eventValue':    value     // Added only if label and value are present
}
```

#### Tracker.trackPageView(path, fieldNameObj)

Calls `gaGlobalFunction('customTrackerName.send', 'pageview', path, fieldNameObj);` where `gaGlobalFunction` - GA's global function, `customTrackerName` - custom name of tracker (if present) and `path` (if empty) is set following this logic: `var loc = window.location; path = loc.hash ? loc.hash.substring(1) : (loc.pathname + loc.search);`



## For contributors

#### Installation

* `git clone` this repository
* `npm install`
* `bower install`

#### Running

* `ember server`
* Visit your app at http://localhost:4200.

#### Running Tests

* `ember test`
* `ember test --server`

#### Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).



## Acknowledgement

Product of Roundscope Ukraine LLC. HEAD is https://github.com/roundscope/ember-insights. Based on https://github.com/roundscope/web-engineering mastery.
