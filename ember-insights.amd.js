define("ember-insights", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var initializer, self;

    self = this;

    initializer = {
      configure: (function(_this) {
        return function(env, settings) {
          _this.configs || (_this.configs = []);
          return _this.configs[env] = settings;
        };
      })(this),
      start: (function(_this) {
        return function(env) {
          _this.settings = _this.configs[env];
          Ember.assert("can't find settings for '" + env + "' environment", _this.settings);
          Ember.assert("can't find 'insights' map for '" + env + "' environment", _this.settings.insights);
          _this.settings.insights = Ember.Object.create(_this.settings.insights);
          Ember.ActionHandler.reopen({
            send: _this.middleware
          });
          return _this.utils;
        };
      })(this)
    };

    this.utils = {
      hasGA: function() {
        return window.ga && typeof window.ga === 'function';
      },
      sendEvent: function(category, action) {
        if (this.hasGA()) {
          return ga('send', 'event', category, action);
        } else {
          return Ember.debug("Can't tsend event due to the `window.ga` is not a 'function'");
        }
      },
      trackPageView: function(path) {
        var loc;
        if (this.hasGA()) {
          if (!path) {
            loc = window.location;
            path = loc.hash ? loc.hash.substring(1) : loc.pathname + loc.search;
          }
          return ga('send', 'pageview', path);
        } else {
          return Ember.debug("Can't track page view due to the `window.ga` is not a 'function'");
        }
      }
    };

    this.middleware = function(actionName) {
      var a, b, c, context, d, match, routeName, router;
      router = this.container.lookup('router:main').router;
      if (router) {
        routeName = router.currentHandlerInfos[router.currentHandlerInfos.length - 1].name;
        match = function(path, entity) {
          return self.settings.insights.getWithDefault(path, []).indexOf(entity) !== -1;
        };
        context = actionName === 'transition' ? (a = match('transitions', routeName), b = match('transitions', routeName.replace('.index', '')), c = match("map." + routeName + ".actions", 'transition'), d = match("map." + (routeName.replace('.index', '')) + ".actions", 'transition'), a || b || c || d ? {
          category: 'transition',
          action: routeName
        } : void 0) : (a = match('actions', actionName), b = match("map." + routeName + ".actions", actionName), c = match("map." + (routeName.replace('.index', '')) + ".actions", actionName), a || b || c ? {
          category: 'action',
          action: actionName
        } : void 0);
        if (context) {
          self.utils.sendEvent(context.category, context.action);
        }
      }
      if (self.settings.debug) {
        Ember.debug("TRAP: '" + actionName + "' action from '" + routeName + "' route");
        if (context) {
          Ember.debug("TRAP MATCHED: '" + actionName + "' action ");
        }
      }
      return this._super.apply(this, arguments);
    };

    __exports__["default"] = initializer;
  });