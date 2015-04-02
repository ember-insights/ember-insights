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
        var template = { prompt: "Ember-Insights%@: '%@'", p1: " from '%@':'%@'", p2: " %@ '%@':'%@'" };
        var msg = Ember.String.fmt(template.prompt, isMapped, eventName);
        if (data.prevRouteName) { msg += Ember.String.fmt(template.p1, data.prevRouteName, data.oldUrl); }
        var prep = (type === 'action') ? 'action from' : 'to';
        if (data.routeName)    { msg += Ember.String.fmt(template.p2, prep, data.routeName, data.url); }

        Ember.debug(msg);
      }
      processMatchedGroups(matchedGroups, addon.settings, type, data);
    }


    // middleware for actions
    function actionMiddleware(actionName) {
      // use original implementation if addon is not activated
      if (!addon.isActivated) { this._super.apply(this, arguments); return; }

      var appController   = this.container.lookup('controller:application');
      var routeName       = appController.get('currentRouteName');
      var route           = this.container.lookup('route:' + routeName);
      var url             = this.container.lookup('router:main').get('url');
      var actionArguments = [].slice.call(arguments, 1);

      Ember.run.schedule('afterRender', this, function() {
        _handle('action', {
          actionName:       actionName,
          actionArguments:  actionArguments,
          route:            route,
          routeName:        routeName,
          url:              url
        });
      });

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
