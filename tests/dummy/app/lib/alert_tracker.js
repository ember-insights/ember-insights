/* global Ember, alert */
import AbstractTracker from 'ember-insights/trackers/abstract-tracker';

function logger(label, ...params) {
  let message = Ember.String.fmt('AlertTracker.%@(%@)', label, params);
  alert(message);
}

class AlertTracker extends AbstractTracker {
  set(key, value) {
    logger('set', key, value);
  }
  send(fieldNameObj) {
    logger('send', fieldNameObj);
  }
  sendEvent(category, action, label, value) {
    logger('sendEvent', category, action, label, value);
  }
  trackPageView(path, fieldNameObj) {
    logger('trackPageView', 'pageview', path, fieldNameObj);
  }
}
export default {
  factory: () => new AlertTracker()
};
