_Hey, listen! This is alpha-level software with incomplete features and planned future changes. Users's metrics are extensive, and not trivial to implement. `ember-insights.js` is heavily based on Google Analytics._

[![NPM version](http://img.shields.io/npm/v/ember-insights.svg)](https://npmjs.org/package/ember-insights) [![Build Status](https://travis-ci.org/ember-insights/ember-insights.svg?branch=master)](https://travis-ci.org/ember-insights/ember-insights) [![Ember Observer Score](http://emberobserver.com/badges/ember-insights.svg)](http://emberobserver.com/addons/ember-insights) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ember-insights/ember-insights/blob/master/LICENSE.md)

## Getting started

`$` `ember install:addon ember-insights`

Use blueprint for generating configs and initializer.

`$` `ember generate ember-insights-initializer ember-insights`

Or you could manually drop an initializer.

```javascript
import EmberInsights from 'ember-insights';

export default {
  name: 'ember-insights',
  initialize: function(/*container, application*/) {
    EmberInsights.configure().track().start();
  }
};
```

In additional, there is available an AMD module and Bower component, find more details here [ember-insights.amd.js](https://github.com/ember-insights/ember-insights.amd.js).

## Live demo

The easiest way to find out more details is checking [live demo](http://ember-insights.github.io/#example-component) and their sources.

## Getting more details

This section describes how-to tweak configuration for what you need.

```javascript
import EmberInsights from 'ember-insights';
```

There are a couple of separate steps for specifying tracking such as
`configure`, `track` and finally `start` and `stop`.

The simplest way to start tracking by default:

```javascript
EmberInsights.configure().track().start();
```

Defines a `default` environment with `ConsoleTracker` and sends all transitions and actions to `Ember.Logger.log`.

### #configure/2 and #configure/0 (as a default convinience)

Defines environment-specific trackers and their options.

* `name` - Specifies name, sets `default` name by default.
* `settings` - Defines options such as:
  * `debug:boolean` - Pushes messages into `Ember.debug`, sets `true` by default.
  * `trackerFactory:function` - Tracker, uses an `EmberInsights.ConsoleTracker` by default.
  * `trackTransitionsAs:string` - Defines how to track transitions (available options are `pageview` and `event`), uses a `pageview` by default.

Here is a `configure/2` example:

```javascript
EmberInsights.configure('default', {
  debug: true,
  trackerFactory: EmberInsights.ConsoleTracker.factory,
  trackTransitionsAs: 'pageview'
});
```

Which is the same as available by default:

```javascript
EmberInsights.configure();
```

_Tips: [Trackers](https://github.com/ember-insights/ember-insights/wiki#built-in-tracking-adapters) wiki has more specific details._

### #track/1 and #track/0 (as a default convinience)

#### insights

Defines what exactly should be tracked and what kind of things should be ignored at all.

Here is a `track/1` example:

```javascript
EmberInsights.configure().track({
  insights: { ALL_TRANSITIONS: true, ALL_ACTIONS: true }
});
```

Which is the same as available by default:

```javascript
EmberInsights.configure().track();
```

Keep in mind that `track/1` could be used for specifying particular piece
of application that should(not) be tracked. You are able to call the `track/1` in chain.

```javascript
}).track({
  insights: { /*specific part of application that should(not) be tracked */ }
}).track({
  insights: { /*specific part of application that should(not) be tracked */ }
});
```

Each `insights` definition could provide its own `dispatch`er function and overwrite default `dispatch`er. The `dispatch/3` enables you
to submit a custom insight other that sends by default in context of specific `track/1` definition.

```javascript
}).track({
  insights: { /*specific part of application that should(not) be tracked */ },
  dispatch: function(type, context, tracker) {
    tracker.sendEvent(/*specific event*/);
    tracker.sendEvent(/*specific event*/);
  }
}).track({
  insights: { /*specific part of application that should(not) be tracked */ }
});
```

_Tips: [Tracking mappings](https://github.com/ember-insights/ember-insights/wiki#tracking-metrics) page has more specific details._

### #start/1 and #stop/0

Runtime management. So that, you are be able to `start` by environment name and `stop` tracking at all.

## Advanced #configure/1

This one provides you a bit different way for specifying environments as described before. The main purpose is
ability to specify environments and apply all further `track`s for all environments recursively.

Here is a short example:

```javascript
EmberInsights.configure({
  'development': { trackerFactory: EmberInsights.ConsoleTracker.factory },
  'production':  { trackerFactory: EmberInsights.GoogleTracker.factory },
}).track({
  insights: { /*specific part of application that should(not) be tracked */ }
}).track({
  insights: { /*specific part of application that should(not) be tracked */ }
});
```

It provides ability to drop a message to `Ember.Logger.log` console for `development`
and sends insights into the Google Analytics in `production` mode.

## Ask for help

Check out the [wiki](https://github.com/ember-insights/ember-insights/wiki). If you feel like porting or fixing something, please drop a [pull request](https://github.com/ember-insights/ember-insights/pulls) or [issue tracker](https://github.com/ember-insights/ember-insights/issues) at GitHub! Check out the [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

I believe that with the help of everyone we can bring this to Ember in a modular and robust way.

## Acknowledgement

Product of Roundscope Ukraine LLC. HEAD is https://github.com/ember-insights/ember-insights.

[![Analytics](https://ga-beacon.appspot.com/UA-60632001-5/ember-insights/ember-insights/README)](https://github.com/igrigorik/ga-beacon)
