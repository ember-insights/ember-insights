/* global Ember */

import runtime    from './runtime';
import middleware from './middleware';

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

export default initializer;
