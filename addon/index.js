/* global Ember */

import runtime    from './runtime';
import middleware from './middleware';

var initializer = (function() {
  var Addon = new (function() { // jshint ignore:line

    this.isActivated  = false;
    this.configs      = {};
    this.settings     = null;

  })();

  // start catching all of actions and transitions
  middleware.use(Addon);

  return runtime(Addon);

})();

export default initializer;
