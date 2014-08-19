ember-insights
==============

Installation
------------

Enable through Ember initializer
```coffeescript
`import GoogleAnalyticInsights from '../utils/ember-insights'`

initializer =

  name: 'Google Analytics insights'

  initialize: (container, application)->
    GoogleAnalyticInsights.configure('staging', {
        debug: true
        insights:
          transitions: ['page.dashboard']
          actions: ['publishPage']
          map:
            page:
              editor:
                actions: ['transition', 'fullPageSave']
      })

    runtime = GoogleAnalyticInsights.start('staging')

    runtime.trackPageView()

`export default initializer`
```

Refs
----

Product of [Roundscope LLC](http://roundscope.com). HEAD is https://github.com/roundscope/ember-insights. Based on https://github.com/roundscope/web-engineering mastery.
