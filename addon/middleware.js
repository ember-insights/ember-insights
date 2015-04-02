/* global Ember */
import { getMatchedGroups, processMatchedGroups } from './matcher';

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
        if (data.prevRouteName) { msg += " from '%@':'%@'".fmt(data.prevRouteName, data.prevUrl); }
        var prep = (type === 'action') ? 'action from' : 'to';
        if (data.routeName)    { msg += " %@ '%@':'%@'".fmt(prep, data.routeName, data.url); }

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

      var appController  = this.container.lookup('controller:application');
      var prevRouteName  = appController.get('currentRouteName');
      var prevUrl        = (prevRouteName ? this.get('url') : '');
      var newRouteName   = arguments[0][arguments[0].length-1].name;

      Ember.run.schedule('afterRender', this, function() {
        _handle('transition', {
          route:         this.container.lookup('route:' + newRouteName),
          routeName:     newRouteName,
          prevRouteName: prevRouteName,
          url:           (this.get('url') || '/'),
          prevUrl:       prevUrl
        });
      });

      this._super.apply(this, arguments);
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
