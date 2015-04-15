/* global Ember */
import runtime    from './runtime';
import middleware from './middleware';

let version = '0.4.0';
Ember.libraries.register('Ember Insights', version);

export default ( () => {
  let Addon = {
    isActivated:  false,
    configs:      {},
    settings:     null
  };

  middleware.use(Addon);

  let instance     = runtime(Addon);
  instance.VERSION = version;

  return instance;
})();
