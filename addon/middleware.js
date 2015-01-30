/* global Ember */

import { getMatchedGroups } from './matcher';

export default {
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

      for (var i = 0, len = matchedGroups.length; i < len; i++) {
        var matchedGroup = matchedGroups[i].group;
        var matchedKey   = matchedGroups[i].keyMatched;

        // drop a line to the developer console
        if (addon.settings.debug) {
          Ember.debug("TRAP: ---- MATCHED key '" + matchedKey + "' in group '" + matchedGroup.name + "'");
        }

        if (type === 'transition' && addon.settings.updateDocumentLocationOnTransitions)
          matchedGroup.tracker.set('location', document.URL);
        // handle particular (matched) insight
        matchedGroup.handler(type, data, matchedGroup.tracker);
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
        routeName:        this.container.lookup('controller:application').get('currentRouteName'),
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
