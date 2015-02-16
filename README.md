_Hey, listen! This is alpha-level software with incomplete features and planned future changes. Use at your own risk, expect some instability, disruption and source-level incompatibility for a while yet._

[![Build Status](https://travis-ci.org/roundscope/ember-insights.svg?branch=master)](https://travis-ci.org/roundscope/ember-insights)

## Installation

`npm install --save-dev ember-insights`

### Add initializer

Use generator to create basic configs and initializer. You can customize them to fit your needs. Replace `<initializer-name>` with name you want the initializer to have:

`ember generate insights-basic-setup <initializer-name>`

### Setup Google Analytics snippet

```html
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  // Replace UA-XXXX-Y with your Tracking ID
  ga('create', 'UA-XXXX-Y', 'auto', {
    // 'name': 'customTracker',  // custom name for tracker
    'cookieDomain': 'none'       // for development on localhost
  });
</script>
```

### You can use custom trackers, such as included console tracker(userful for development), or build your own

```javascript
...
import Insights from 'ember-insights';
...
      Insights.configure('production', {
        debug: true,
        trackerFactory: Insights.ConsoleTracker.factory
      }).track({
        insights: {
          ALL_TRANSITIONS: true, ALL_ACTIONS: true
        }
      });
```


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
