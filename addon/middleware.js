/* global Ember */
import { getMatchedGroups, processMatchedGroups } from './matcher';

export default {
  use: (addon) => {
    function _handle(type, data) {
      let eventName, valueToMatch;

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

      let matchedGroups = getMatchedGroups(addon.settings.mappings, data.routeName, type, valueToMatch);

      // drop a line to the Ember.debug
      if (addon.settings.debug) {
        let isMapped = (matchedGroups.length ? ' SEND' : ' TRAP');
        let template = { prompt: "Ember-Insights%@: '%@'", p1: " from '%@':'%@'", p2: " %@ '%@':'%@'" };
        let msg = Ember.String.fmt(template.prompt, isMapped, eventName);
        if (data.prevRouteName) { msg += Ember.String.fmt(template.p1, data.prevRouteName, data.prevUrl); }
        let prep = (type === 'action') ? 'action from' : 'to';
        if (data.routeName)    { msg += Ember.String.fmt(template.p2, prep, data.routeName, data.url); }

        Ember.debug(msg);
      }

      processMatchedGroups(matchedGroups, addon.settings, type, data);
    }

    // middleware for actions
    function actionMiddleware(actionName, ...actionArguments) {
      // use original implementation if addon is not activated
      if (!addon.isActivated) { this._super(...arguments); return; }

      let appController   = this.container.lookup('controller:application');
      let routeName       = appController.get('currentRouteName');
      let route           = this.container.lookup('route:' + routeName);
      let url             = this.container.lookup('router:main').get('url');

      Ember.run.schedule('afterRender', this, () => {
        _handle('action', {
          actionName:       actionName,
          actionArguments:  actionArguments,
          route:            route,
          routeName:        routeName,
          url:              url
        });
      });

      this._super(...arguments);
    }

    // middleware for transitions
    function transitionMiddleware() {
      // use original implementation if addon is not activated
      if (!addon.isActivated) { this._super(...arguments); return; }

      let appController  = this.container.lookup('controller:application');
      let prevRouteName  = appController.get('currentRouteName');
      let prevUrl        = (prevRouteName ? this.get('url') : '');
      let newRouteName   = arguments[0][arguments[0].length-1].name;

      Ember.run.schedule('afterRender', this, () => {
        _handle('transition', {
          route:         this.container.lookup('route:' + newRouteName),
          routeName:     newRouteName,
          prevRouteName: prevRouteName,
          url:           (this.get('url') || '/'),
          prevUrl:       prevUrl
        });
      });

      this._super(...arguments);
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
