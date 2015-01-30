[![Build Status](https://travis-ci.org/roundscope/ember-insights.svg)](https://travis-ci.org/roundscope/ember-insights)

# Ember-insights

Designed as Ember CLI addon and will be used for tracking user's behavior and interaction.


## Installation

`npm install --save-dev ember-insights`


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

### Drop an initializer

```javascript
import Ember    from 'ember';
import Insights from 'ember-insights';
import ENV      from '../config/environment'

export default {

  name: 'my-app-insights',

  initialize: function (container, application) {
    // configure insights for certain environment
    Insights.configure('production', {
      debug: true
    }).track({
      insights: {
        ALL_TRANSITIONS: true, ALL_ACTIONS: true
      }
    });


    if(ENV.environment === 'production') {
      Insights.start('production');
    }
  }
};
```

### You can use custom trackers, such as console tracker

```javascript
import ConsoleTracker from 'ember-insights/console-tracker';
...
      Insights.configure('production', {
        debug: true,
        trackerFactory: ConsoleTracker.factory
      }).track({
        insights: {
          ALL_TRANSITIONS: true, ALL_ACTIONS: true
        }
      });
```


## Insights

#### Insights.configure(namespace, config)
Configures namespace.
* __namespace__ (string). Environment specific settings. You can name it as you wish.
* __config__ (object). Configuration object. This object can contain next parameters:
  * __*debug*__ (boolean). Set this to `true` to see debug messages in browsers console.
  * __*trackerFun*__ (string, default - `ga` or function). Name of Google Analytics' global function.
  * __*trackingNamespace*__ (string). Set this parameter if Google Analytics' tracking object was created with custom name (`ga('create', 'UA-12345-6', 'auto', {'name': 'newTracker'});`)
  * __*trackerFactory*__ (function). Factory function that returns custom tracker instance
  * __*trackTransitionsAs*__ (string `'pageview'`, `'event'` or `'both'`; default - `'pageview'`). Used only with default handler. Defines how to send matched transitions to Google Analytics. Use `'pageview'` to track transitions as hit with `'hitType': 'pageview'` or use `event` to track transitions as hit with `'hitType': 'event'`, `'eventCategory': 'ember_transition'` and `'eventAction'` similar to `'{"from":"main","to":"main.record"}'`
  * __*updateDocumentLocationOnTransitions*__ - (boolean, default - `true`). Google Analytics doesn't refresh `location` param. Ember-insights sets the `location` value each time after transition done.

#### #track(mapping)
Registers in the `namespace` new `group` of transitions and/or actions you want to track. Each added group can be later removed from namespace (use group's name to remove) and each group has its own handler - default or custom function that will send information about matched transition/action to Google Analytics.
* __mapping__ (object). Configure added group:
  * __*trackerFun*__ (string, default - `ga`). Name of Google Analytics' global function.
  * __*trackingNamespace*__ (string). Set this parameter if Google Analytics' tracking object was created with custom name (`ga('create', 'UA-12345-6', 'auto', {'name': 'newTracker'});`)
  * __*trackerFactory*__ (function). Factory function that returns custom tracker instance
  * __*insights*__ (object). Describes transitions and/or actions to track. More detailed description below.
  * __*handler*__ (function). Function that sends information about matched transition/action to Google Analytics. More detailed description below.

#### Insights.start(namespace)
Starts tracking of transitions and/or actions registered in `namespace`. Returns 'Tracker' object that you can use for custom operations in your code (More detailed description of 'Tracker' object below).

#### Insights.stop()
Stops tracking of all transitions/actions.



## Describing groups
When calling `track` you should pass `insights` object and can pass `handler` function as the part of configuration object. `insights` object describes insights (transitions and/or actions) you want to track and `handler` function is responsible for sending of information about matched transition/action to Google Analytics.

#### insights object
Examples of defining rules:

```javascript
// track all transitions
insights: {
  ALL_TRANSITIONS: true
}
```

```javascript
// track all actions
insights: {
  ALL_ACTIONS: true
}
```

```javascript
// track all transitions except of transitions to `main.record`, `main.record.index`, `outer` and `outer.index` routes
insights: {
  ALL_TRANSITIONS: {
    except: ['main.record', 'outer']
  }
}
```

```javascript
// track all actions except of `testAction2` and `testAction3`
insights: {
  ALL_ACTIONS: {
    except: ['testAction2', 'testAction3']
  }
}
```

```javascript
// track only transitions to `index`, `outer.inner.nested`, `outer.inner.nested.index` routes
insights: {
  TRANSITIONS: ['index', 'outer.inner.nested']
}
```

```javascript
// track only `testAction1` action
insights: {
  ACTIONS: ['testAction1']
}
```

```javascript
// track only transitions to `outer`, `outer.index`, `outer.inner`, `outer.inner.index` routes
insights: {
  MAP: {
    outer: {
      ACTIONS: ['TRANSITION'],
      inner: {
        ACTIONS: ['TRANSITION']
      }
    }
  }
}
```

```javascript
// track only action `testAction3` fired on `outer` or `outer.index` routes
// and action `testAction1` fired on `outer.inner` or `outer.inner.index` routes
insights: {
  MAP: {
    outer: {
      ACTIONS: ['testAction3'],
      inner: {
        ACTIONS: ['testAction1']
      }
    }
  }
}
```

```javascript
// track only action `testAction3` fired on `outer` or `outer.index` routes
// and transition to `outer` or `outer.index` routes
insights: {
  MAP: {
    outer: {
      ACTIONS: ['TRANSITION', 'testAction3']
    }
  }
}
```

NOTICE: All defined rules are combined all together. Look at the following example below to understand what kind of transitions/actions will be tracked or skipped.

```javascript
// records all transitions (includes `fulltrack` and `fulltrack.index`) except transitions to `outer`, `outer.index` routes
// records all actions (includes `partialtrack` just only for routes such as `outer.inner` and `outer.inner.index`) except action such as `testAction3`
insights: {
  TRANSITIONS: ['fulltrack'],
  ALL_TRANSITIONS: { except: ['fulltrack', 'outer'] },
  ALL_ACTIONS: { except: ['partialtrack', 'testAction3'] },
  MAP: {
    outer: {
      inner: {
        ACTIONS: ['partialtrack']
      }
    }
  }
}
```

#### handler(type, options, tracker)
You can use your own custom handler to define how to send information about matched transition/action to Google Analytics
* __type__ (string, `transition` or `action`).
* __options__ (object). Information about matched transition/action. Use it to build your custom message.
```javascript
  // Example of options object for action triggered by click
  //     on `<button {{action 'testAction2' 'arg21'}}>testAction2</button>`
  {
    actionArguments: ["arg21"],
    actionName: "testAction2",
    route: /*<dummy@route:main/record::ember333>*/,
    routeName: "main.record"
    url: "/main/8"
  }
```
```javascript
  // Examples of options object for transitions
  // example 1 (entered http://localhost:4200/main/9 in address bar)
  {
    oldRouteName: undefined,
    oldUrl: "",
    route: /*<dummy@route:main/record::ember333>*/,
    routeName: "main.record",
    url: "/main/9"
  }
  // example 2 (transition from /outer/inner/34 to /main/8)
  {
    oldRouteName: "outer.inner.nested",
    oldUrl: "/outer/inner/34",
    route: /*<dummy@route:main/record::ember333>*/,
    routeName: "main.record",
    url: "/main/8"
  }
```

* __tracker__ (object). More detailed description of 'Tracker' object below.

Example of custom handler function:
```javascript
Insights.configure('staging').track({
  insights: { ALL_TRANSITIONS: true },
  // example of custom handler for matched events
  handler: function(type, options, tracker) {
    if (type !== 'transition') {
      // Something is wrong! This group is for transitions only!
      return;
    }

    var route = options.route;
    var controller = route.get('controller');
    var model = controller.get('model');
    var message = options.routeName + " (record #" + model.get('recordData') + ")";

    // pass matched event to Google Analytic service
    tracker.sendEvent(type, message);
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

Product of [Roundscope LLC](http://roundscope.com). HEAD is https://github.com/roundscope/ember-insights. Based on https://github.com/roundscope/web-engineering mastery.
