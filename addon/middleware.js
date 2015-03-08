/* global Ember */
import { getMatchedGroups, processMatchedGroups, processTiming } from './matcher';

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
        var isMapped = (matchedGroups.length ? ' SEND' : ' TRAP');
        var msg = "Ember-Insights%@: '%@'".fmt(isMapped, eventName);
        if (data.oldRouteName) { msg += " from '%@':'%@'".fmt(data.oldRouteName, data.oldUrl); }
        var prep = (type === 'action') ? 'action from' : 'to';
        if (data.routeName)    { msg += " %@ '%@':'%@'".fmt(prep, data.routeName, data.url); }

        Ember.debug(msg);
      }
      var eventValue = valueToMatch;
      if (type === 'transition') {
        eventValue = eventValue.replace('.index', '');
      }
      processTiming(addon.settings, type, eventValue);
      processMatchedGroups(matchedGroups, addon.settings, type, data, eventValue);
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
        var newUrl = (this.get('url') || '/');
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
