/* global Ember */
import AbstractTracker from './abstract-tracker';

function logger(label, params) {
  let message = Ember.String.fmt('LOG: Ember-Insights: ConsoleTracker.%@(%@)', label, params);
  Ember.Logger.log(message);
}

class ConsoleTracker extends AbstractTracker {
  set(key, value) {
    logger('set', [key, value]);
  }
  send(fieldNameObj) {
    logger('send', [fieldNameObj]);
  }
  sendEvent(category, action, label, value) {
    logger('sendEvent', [category, action, label, value]);
  }
  trackPageView(path, fieldNameObj) {
    logger('trackPageView', ['pageview', path, fieldNameObj]);
  }
}


export default {
  factory: () => new ConsoleTracker()
};
