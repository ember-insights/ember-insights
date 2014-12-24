/* global Ember */

var initializer = (function() {
  var Addon = new (function() { // jshint ignore:line

    // configs for different envs
    this.configs = {};

    // current config
    this.settings = null;

    // private function that returns GA global function
    var gaGlobFunc = function() {
      return window[Addon.settings.gaGlobalFuncName];
    };

    // private function that returns prefix for current GA tracker
    var gaTrackerPrefix = function() {
      if (Addon.settings.gaTrackerName) {
        return Addon.settings.gaTrackerName + '.';
      }
      return '';
    };

    // Some convenience as wrappers for extending the GA global function
    this.utils = {
      hasGA: function() {
        return (gaGlobFunc() && typeof gaGlobFunc() === 'function');
      },
      sendEvent: function(category, action) {
        if (this.hasGA()) {
          (gaGlobFunc())(gaTrackerPrefix() + 'send', 'event', category, action);
        }
        else {
          Ember.debug("Can't send event due to the `window." + Addon.settings.gaGlobalFuncName + "` is not a 'function'");
        }
      },
      trackPageView: function(path, fieldNameObj) {
        if (this.hasGA()) {
          fieldNameObj = fieldNameObj || {};
          if (!path) {
            var loc = window.location;
            path = loc.hash ? loc.hash.substring(1) : (loc.pathname + loc.search);
          }
          (gaGlobFunc())(gaTrackerPrefix() + 'send', 'pageview', path, fieldNameObj);
        }
        else {
          Ember.debug("Can't track page view due to the `window." + Addon.settings.gaGlobalFuncName + "` is not a 'function'");
        }
      }
    };

    // middleware that replaces/extends default ActionHandler.send method
    this.middleware = function(actionName) {
      var router, routeName, routeNameNoIndex,
          matches, matchFound = false, context;

      // get active router
      router = this.container.lookup('router:main').router;

      if (router) {
        // get the from route name
        routeName = router.currentHandlerInfos[router.currentHandlerInfos.length - 1].name;
        routeNameNoIndex = routeName.replace('.index', '');

        // try to find out particular insight declaration
        var match = function(path, entity) {
          return (Addon.settings.insights.getWithDefault(path, []).indexOf(entity) > -1);
        };
        var matchAny = function(arr) {
          for (var i=0, len=arr.length; i<len; i++) {
            if ( match(arr[i][0], arr[i][1]) ) { return true; }
          }
          return false;
        };

        // look for the insight declaration
        if (actionName === 'transition') {
          // TODO: Legacy code. Check if transition to route can trigger action with
          //   actionName equal to 'transition'
          context = { category: 'transition', action: routeName };
          matches = [
            ['transitions', routeName       ],
            ['transitions', routeNameNoIndex],
            ["map." + routeName        + ".actions", 'transition'],
            ["map." + routeNameNoIndex + ".actions", 'transition']
          ];
        }
        else {
          context = { category: 'action', action: actionName };
          matches = [
            ['actions', actionName],
            ["map." + routeName        + ".actions", actionName],
            ["map." + routeNameNoIndex + ".actions", actionName]
          ];
        }

        if (matchAny(matches)) {
          matchFound = true;
          // pass matched event to Google Analytic service
          Addon.utils.sendEvent(context.category, context.action);
        }
      }

      // drop a line to the developers console
      if (Addon.settings.debug) {
        var msg = "TRAP" + (matchFound ? ' (MATCHED)' : '') + ": '" + actionName + "' action";
        if (routeName) {
          msg += " from '" + routeName + "' route";
        }
        Ember.debug(msg);
      }

      // bubble event back to the Ember engine
      this._super.apply(this, arguments);
    };

  })();

  return {
    configure: function(env, settings) {
      // 0. assert settings
      // X. assign settings by particular environment
      settings.gaGlobalFuncName = settings.gaGlobalFuncName || 'ga';
      Addon.configs[env] = settings;
    },
    start: function(env) {
      Addon.settings = Addon.configs[env];
      Ember.assert("can't find settings for '" + env + "' environment", Addon.settings);
      // assert insights map
      Ember.assert("can't find 'insights' map for '" + env + "' environment", Addon.settings.insights);
      Addon.settings.insights = Ember.Object.create(Addon.settings.insights);
      // start catching events from ActionHandler and apply them w/ specified insights map
      Ember.ActionHandler.reopen({
        send: Addon.middleware
      });

      return Addon.utils;
    }
  };

})();

export default initializer;
