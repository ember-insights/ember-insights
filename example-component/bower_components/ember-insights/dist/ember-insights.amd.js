define("ember-insights", 
  ["runtime","middleware","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var runtime = __dependency1__["default"];
    var middleware = __dependency2__["default"];

    var initializer = (function() {
      var Addon = {
        isActivated:  false,
        configs:      {},
        settings:     null
      };

      // start catching all of actions and transitions
      middleware.use(Addon);

      return runtime(Addon);
    })();

    __exports__["default"] = initializer;
  });
define("handler", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function transitionHandler(data, tracker, settings) {
      var trackType = settings.trackTransitionsAs;

      if (trackType === 'event'    || trackType === 'both') {
        tracker.sendEvent(
          'ember_transition',
          JSON.stringify({ from: data.oldRouteName, to: data.routeName })
        );
      }
      if (trackType === 'pageview' || trackType === 'both') {
        tracker.trackPageView(data.url);
      }
    }

    function actionHandler(data, tracker, settings) {
      settings = settings || {};
      var args = ['ember_action', data.actionName];

      var actionLabel = data.actionArguments[0];
      var actionValue = data.actionArguments[1];

      if (actionLabel != null) {
        args[2] = actionLabel;
        if (actionValue != null) {
          args[3] = actionValue;
        }
      }

      tracker.sendEvent.apply(tracker, args);
    }


    __exports__["default"] = {
      factory: function(settings) {
        var handler = function(type, data, tracker) {
          if (type === 'transition') {
            transitionHandler(data, tracker, settings);
          }

          if (type === 'action') {
            actionHandler(data, tracker, settings);
          }
        };

        return handler;
      },

      transitionHandler: transitionHandler,
      actionHandler: actionHandler
    };
  });
define("matcher", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /* global Ember */

    function groupMatches(group, routeName, eventType, eventValueToMatch) {
      var routeNameNoIndex = routeName.replace('.index', '');

      var allKey = 'ALL_' + eventType.toUpperCase() + 'S';
      var all = group.insights.getWithDefault(allKey, false);

      if ( checkInAll(all, eventType, eventValueToMatch, routeNameNoIndex) ) {
        return allKey;
      }

      var toMatch = getSearchingPaths(eventType, routeName, routeNameNoIndex, eventValueToMatch);

      for (var i = 0, len = toMatch.length; i < len; i++) {
        var path   = toMatch[i][0];
        var entity = toMatch[i][1];
        if (group.insights.getWithDefault(path, []).indexOf(entity) > -1) {
          return path;
        }
      }

      return false;
    }

    function getSearchingPaths(eventType, routeName, routeNameNoIndex, eventValueToMatch) {
      if (eventType === 'transition') {
        return [
          ['TRANSITIONS', routeName       ],
          ['TRANSITIONS', routeNameNoIndex],
          ['MAP.' + routeName        + '.ACTIONS', 'TRANSITION'],
          ['MAP.' + routeNameNoIndex + '.ACTIONS', 'TRANSITION']
        ];
      } else if (eventType === 'action') {
        return [
          ['ACTIONS', eventValueToMatch],
          ['MAP.' + routeName        + '.ACTIONS', eventValueToMatch],
          ['MAP.' + routeNameNoIndex + '.ACTIONS', eventValueToMatch]
        ];
      }
    }

    function getMatchedGroups(groups, routeName, eventType, eventValueToMatch) {
      var result = [];
      for (var i = 0, len = groups.length; i < len; i++) {
        var group = groups[i];
        var keys  = groupMatches(group, routeName, eventType, eventValueToMatch);
        pushToResult(keys, group, result);
      }
      return result;
    }

    function pushToResult(keyMatched, group, holder) {
      if (keyMatched) {
        holder.push({ group: group, keyMatched: keyMatched });
      }
    }

    function checkInAll(matchAllConfig, eventType, eventValueToMatch, routeNameNoIndex) {
      if (matchAllConfig === true) {
        return true;
      }
      else if (typeof matchAllConfig === 'object' && matchAllConfig.except) {
        var listOfExcepted = matchAllConfig.except;
        var valuesToMatch = [ eventValueToMatch ];
        if (eventType === 'transition' && routeNameNoIndex !== eventValueToMatch) {
          valuesToMatch.push(routeNameNoIndex);
        }

        if (Ember.EnumerableUtils.intersection(valuesToMatch, listOfExcepted).length === 0) {
          return true;
        }
      }
      return false;
    }

    function processMatchedGroups(matchedGroups, addonSettings, eventType, eventParams){
        for (var i = 0, len = matchedGroups.length; i < len; i++) {
          var matchedGroup = matchedGroups[i].group;
          var matchedKey   = matchedGroups[i].keyMatched;

          // drop a line to the developer console
          if (addonSettings.debug) {
            Ember.debug("TRAP: ---- MATCHED key '" + matchedKey + "' in group '" + matchedGroup.name + "'");
          }

          if (eventType === 'transition' && addonSettings.updateDocumentLocationOnTransitions) {
            matchedGroup.tracker.set('location', document.URL);
          }
          // handle particular (matched) insight
          matchedGroup.handler(eventType, eventParams, matchedGroup.tracker);
        }
    }

    __exports__.getMatchedGroups = getMatchedGroups;
    __exports__.processMatchedGroups = processMatchedGroups;
    __exports__.pushToResult = pushToResult;
    __exports__.getSearchingPaths = getSearchingPaths;
    __exports__.checkInAll = checkInAll;
  });
define("middleware", 
  ["matcher","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global Ember */

    var getMatchedGroups = __dependency1__.getMatchedGroups;
    var processMatchedGroups = __dependency1__.processMatchedGroups;

    __exports__["default"] = {
      use: function(addon) {
        function _handle(type, data) {
          var eventName, valueToMatch;

          switch (type) {
            case 'transition':
              eventName     = type;
              valueToMatch  = data.routeName;
              break;
            case 'action':
              eventName     = data.actionName;
              valueToMatch  = data.actionName;
              break;
          }

          // look up for all matching insight mappings
          var matchedGroups = getMatchedGroups(addon.settings.mappings, data.routeName, type, valueToMatch);

          // drop a line to the console log
          if (addon.settings.debug) {
            var msg = "TRAP: '" + eventName + "' action";
            var word = (type === 'action') ? " on '" : " to '";
            if (data.oldRouteName) { msg += " from '" + data.oldRouteName + "' route (" + data.oldUrl + ")"; }
            if (data.routeName)    { msg += word      + data.routeName    + "' route (" +    data.url + ")"; }
            msg += matchedGroups.length ? '. Matches:' : '. No matches!';
            Ember.debug(msg);
          }
          processMatchedGroups(matchedGroups, addon.settings, type, data);
        }


        // middleware for actions
        function actionMiddleware(actionName) {
          // use original implementation if addon is not activated
          if (!addon.isActivated) { this._super.apply(this, arguments); return; }

          var appController = this.container.lookup('controller:application');
          var routeName     = appController.get('currentRouteName');

          _handle('action', {
            actionName:       actionName,
            actionArguments:  [].slice.call(arguments, 1),
            route:            this.container.lookup('route:' + routeName),
            routeName:        this.container.lookup('controller:application').get('currentRouteName'),
            url:              this.container.lookup('router:main').get('url')
          });

          // bubble event back to the Ember engine
          this._super.apply(this, arguments);
        }

        // middleware for transitions
        function transitionMiddleware() {
          // use original implementation if addon is not activated
          if (!addon.isActivated) { this._super.apply(this, arguments); return; }

          var appController = this.container.lookup('controller:application');
          var oldRouteName  = appController.get('currentRouteName');
          var oldUrl        = oldRouteName ? this.get('url') : '';

          this._super.apply(this, arguments); // bubble event back to the Ember engine

          var newRouteName = appController.get('currentRouteName');

          Ember.run.scheduleOnce('routerTransitions', this, function() {
            var newUrl = this.get('url');
            _handle('transition', {
              route:        this.container.lookup('route:' + newRouteName),
              routeName:    newRouteName,
              oldRouteName: oldRouteName,
              url:          newUrl,
              oldUrl:       oldUrl
            });
          });
        }

        // start catching actions
        Ember.ActionHandler.reopen({
          send: actionMiddleware
        });
        // start catching transitions
        Ember.Router.reopen({
          didTransition: transitionMiddleware
        });
      }
    };
  });
define("optparse", 
  ["trackers/google","handler","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    /* global Ember */
    var DefaultTracker = __dependency1__["default"];
    var DefaultHandler = __dependency2__["default"];

    __exports__["default"] = {
      trackerOpts: function(opts) {
        return this.mergeTrackerOpts(opts, opts);
      },

      mergeTrackerOpts: function(opts, basicOpts) {
        var assert, typeOf;

        opts.trackerFun = (opts.trackerFun || basicOpts.trackerFun || 'ga');
        typeOf = typeof opts.trackerFun;
        assert = (typeOf === 'function' || typeOf === 'string');
        Ember.assert("'trackerFun' should be either a function or string option", assert);

        opts.trackingNamespace = (opts.trackingNamespace || basicOpts.trackingNamespace || '');
        typeOf = typeof opts.trackingNamespace;
        assert = (typeOf === 'string');
        Ember.assert("'trackingNamespace' should be a string option", assert);

        opts.trackerFactory = (opts.trackerFactory || basicOpts.trackerFactory || DefaultTracker.factory);
        assert = (typeof opts.trackerFactory === 'function');
        Ember.assert("'trackerFactory' should be a function", assert);

        opts.tracker = opts.trackerFactory(opts);
        assert = (typeof opts.tracker === 'object');
        Ember.assert("Can't build tracker", assert);

        opts.trackTransitionsAs = (opts.trackTransitionsAs || basicOpts.trackTransitionsAs || 'pageview');

        return opts;
      },

      basicOpts: function(opts) {
        if (typeof opts.updateDocumentLocationOnTransitions === 'undefined') {
          opts.updateDocumentLocationOnTransitions = true;
        }

        return opts;
      },

      handlerOpts: function(opts) {
        var assert;

        opts.handler = (opts.handler || DefaultHandler.factory(opts));
        assert = (typeof opts.handler === 'function');
        Ember.assert("'handler' should be a function", assert);

        return opts;
      }
    };
  });
define("runtime", 
  ["optparse","trackers","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    /* global Ember */
    var optparse = __dependency1__["default"];
    var ConsoleTracker = __dependency2__.ConsoleTracker;
    var GoogleTracker = __dependency2__.GoogleTracker;


    __exports__["default"] = function(addon) {
      var _settings; // current configuration stage
      var runtime = {
        configure: function(env, settings) {
          env       = (env || 'default');
          settings  = (settings || {});
          _settings = settings;

          // apply defaults
          optparse.basicOpts(settings);
          optparse.trackerOpts(settings);

          if (settings.tracker._setFields) {
            settings.tracker._setFields();
          }

          settings.mappings  = [];
          addon.configs[env] = settings;

          return this;
        },
        track: function(mapping) {
          Ember.assert("Can't find `insights` property inside", mapping.insights);

          // fields params are not yet implemented,
          // - https://github.com/roundscope/ember-insights/issues/56
          delete mapping.fields;

          mapping.insights = Ember.Object.create(mapping.insights);

          // apply defaults
          optparse.mergeTrackerOpts(mapping, _settings);
          optparse.handlerOpts(mapping);

          // setup tracking mapping
          _settings.mappings.push(mapping);

          return this;
        },
        start: function(env) {
          addon.settings = addon.configs[env];
          Ember.assert("can't find settings for '" + env + "' environment", addon.settings);

          addon.isActivated = true;

          return addon.settings.tracker;
        },
        stop: function() {
          addon.isActivated = false;
        },

        // Custom trackers
        ConsoleTracker: ConsoleTracker,
        GoogleTracker:  GoogleTracker

      };

      return runtime;
    }
  });
define("trackers", 
  ["trackers/console","trackers/google","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var ConsoleTracker = __dependency1__["default"];
    var GoogleTracker = __dependency2__["default"];

    __exports__.ConsoleTracker = ConsoleTracker;
    __exports__.GoogleTracker = GoogleTracker;
  });
define("trackers/console", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /* global Ember */

    function trackerFun() {
      return function(){
        console.log('Ember-Insights event');
        console.log('\tAction: ', arguments[0]);
        console.log('\tAction argument: ', arguments[1]);
        if(arguments.length > 2){
          console.log('\tAdditional arguments: ');
          for(var i=2; i < arguments.length; i++){
             console.log('\t\t', arguments[i]);
          }
        }
      };
    }

    function trackingNamespace(name) {
      return function(action) {
        return (name ? name + '.' : '') + action;
      };
    }


    __exports__["default"] = {
      factory: function(settings) {

        var tracker   = trackerFun(settings.trackerFun);
        var namespace = trackingNamespace(settings.trackingNamespace);

        // Runtime conveniences as a wrapper for tracker function
        var wrapper = {
          isTracker: function() {
            return (tracker && typeof tracker === 'function');
          },
          getTracker: function() {
            if (! this.isTracker()) {
              Ember.debug("Can't find in `window` a `" + settings.trackerFun + "` function definition");
            }
            return tracker;
          },

          set: function(key, value) {
            tracker(namespace('set'), key, value);
          },

          send: function(fieldNameObj) {
            fieldNameObj = fieldNameObj || {};
            tracker(namespace('send'), fieldNameObj);
          },
          sendEvent: function(category, action, label, value) {
            var fieldNameObj = {
              'hitType':       'event',  // Required
              'eventCategory': category, // Required
              'eventAction':   action    // Required
            };

            if (label != null) {
              fieldNameObj.eventLabel = label;
              if (value != null) {
                fieldNameObj.eventValue = value;
              }
            }

            tracker(namespace('send'), fieldNameObj);
          },
          trackPageView: function(path, fieldNameObj) {
            fieldNameObj = fieldNameObj || {};

            if (!path) {
              var loc = window.location;
              path = loc.hash ? loc.hash.substring(1) : (loc.pathname + loc.search);
            }

            tracker(namespace('send'), 'pageview', path, fieldNameObj);
          }
        };


        return wrapper;
      },

      trackerFun: trackerFun,
      trackingNamespace: trackingNamespace
    };
  });
define("trackers/google", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /* global Ember */

    function trackerFun(trackerFun, global) {
      global = (global || window);
      if (typeof trackerFun === 'string') {
        trackerFun = global[trackerFun];
      }
      return trackerFun;
    }

    function trackingNamespace(name) {
      return function(action) {
        return (name ? name + '.' : '') + action;
      };
    }

    function setFields(tracker, namespace, fields) {
      for (var propName in fields) {
        tracker(namespace('set'), propName, fields[propName]);
      }
    }

    __exports__["default"] = {
      factory: function(settings) {

        var tracker   = trackerFun(settings.trackerFun);
        var namespace = trackingNamespace(settings.trackingNamespace);

        // Runtime conveniences as a wrapper for tracker function
        var wrapper = {
          _setFields: function() {
            setFields(tracker, namespace, settings.fields);
          },

          isTracker: function() {
            return (tracker && typeof tracker === 'function');
          },
          getTracker: function() {
            if (! this.isTracker()) {
              Ember.debug("Can't find in `window` a `" + settings.trackerFun + "` function definition");
            }
            return tracker;
          },

          set: function(key, value) {
            tracker(namespace('set'), key, value);
          },

          send: function(fieldNameObj) {
            fieldNameObj = fieldNameObj || {};
            tracker(namespace('send'), fieldNameObj);
          },
          sendEvent: function(category, action, label, value) {
            var fieldNameObj = {
              'hitType':       'event',  // Required
              'eventCategory': category, // Required
              'eventAction':   action    // Required
            };

            if (label != null) {
              fieldNameObj.eventLabel = label;
              if (value != null) {
                fieldNameObj.eventValue = value;
              }
            }

            tracker(namespace('send'), fieldNameObj);
          },
          trackPageView: function(path, fieldNameObj) {
            fieldNameObj = fieldNameObj || {};

            if (!path) {
              var loc = window.location;
              path = loc.hash ? loc.hash.substring(1) : (loc.pathname + loc.search);
            }

            tracker(namespace('send'), 'pageview', path, fieldNameObj);
          }
        };


        return wrapper;
      },

      trackerFun: trackerFun,
      trackingNamespace: trackingNamespace,
      setFields: setFields
    };
  });