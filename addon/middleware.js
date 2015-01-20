/* global Ember */
import handlers from './handlers';
import tracker  from './tracker';

export default {
  use: function(addon) {
    var tracker = tracker.build(addon);

    function firstMatchedGroup(toMatchAll, toMatch) {
      var groups = addon.settings.groups;
      for (var i=0, len1=groups.length; i<len1; i++) {
        var group = groups[i];
        var resultGroup = {
          name:     group.name,
          insights: group.insights,
          handler:  group.handler || handlers.main.handler(addon.settings)
        };

        var matchAllType = toMatchAll[0];
        var matchAllConfig = group.insights.getWithDefault(matchAllType, false);
        if (matchAllConfig === true) {
          return resultGroup;
        }
        else if (typeof matchAllConfig === 'object' && matchAllConfig.except) {
          if (
            (toMatchAll[1] && matchAllConfig.except.indexOf(toMatchAll[1]) > -1) ||
            (toMatchAll[2] && matchAllConfig.except.indexOf(toMatchAll[2]) > -1)
          ) {
            // Do nothing! 'except' array which contains exact route or action
          }
          else {
            return resultGroup;
          }
        }

        for (var j=0, len2=toMatch.length; j<len2; j++) {
          var path   = toMatch[j][0],
          entity = toMatch[j][1];
          if (group.insights.getWithDefault(path, []).indexOf(entity) > -1) {
            return resultGroup;
          }
        }
      }
      return false;
    }

    function _handle(type, data) {
      var actionName, toMatchAll, toMatch, oldRouteName, oldUrl,

      url               = data.url,
      routeName         = data.routeName,
      routeNameNoIndex  = routeName.replace('.index', '');

      if (type === 'transition') {
        actionName    = 'transition';
        oldRouteName  = data.oldRouteName;
        oldUrl        = data.oldUrl;

        toMatch = [
          ['TRANSITIONS', routeName       ],
          ['TRANSITIONS', routeNameNoIndex],
          ['MAP.' + routeName        + '.ACTIONS', 'TRANSITION'],
          ['MAP.' + routeNameNoIndex + '.ACTIONS', 'TRANSITION']
        ];

        toMatchAll = ['ALL_TRANSITIONS', routeName, routeNameNoIndex];
      } else if (type === 'action') {
        actionName = data.actionName;
        toMatch = [
          ['ACTIONS', actionName],
          ['MAP.' + routeName        + '.ACTIONS', actionName],
          ['MAP.' + routeNameNoIndex + '.ACTIONS', actionName]
        ];
        toMatchAll = ['ALL_ACTIONS', actionName];
      }

      // look for the insight declaration
      var matchedGroup = firstMatchedGroup(toMatchAll, toMatch);

      if (matchedGroup) {
        matchedGroup.handler(type, data, addon.tracker);
      }

      // drop a line to the developer console
      if (addon.settings.debug) {
        var msg = "TRAP" + (matchedGroup ? " (MATCHED - group '" + matchedGroup.name + "')" : '') + ": '" + actionName + "' action";
        var word = (type === 'action') ? " on '" : " to '";
        if (oldRouteName) { msg += " from '" + oldRouteName + "' route (" + oldUrl + ")"; }
        if (   routeName) { msg += word      +    routeName + "' route (" +    url + ")"; }
        Ember.debug(msg);
      }
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
        routeName:        routeName,
        url:              this.container.lookup('router:main').get('url')
      });

      // bubble event back to the Ember engine
      this._super.apply(this, arguments);
    }

    // middleware for transitions
    function transitionMiddleware(infos) {
      // use original implementation if addon is not activated
      if (!addon.isActivated) { this._super.apply(this, arguments); return; }

      var appController = this.container.lookup('controller:application');
      var oldRouteName  = appController.get('currentRouteName');
      var oldUrl        = oldRouteName ? this.get('url') : '';

      this._super.apply(this, arguments); // bubble event back to the Ember engine

      var newRouteName = appController.get('currentRouteName');

      Ember.run.scheduleOnce('routerTransitions', this, function() {
        var newUrl = this.get('url');

        if (addon.settings.updateDocumentLocationOnTransitions) {
          tracker.set('location', document.URL);
        }

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
