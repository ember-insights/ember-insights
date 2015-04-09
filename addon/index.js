import runtime    from './runtime';
import middleware from './middleware';

var initializer = ( () => {
  let Addon = {
    isActivated:  false,
    configs:      {},
    settings:     null
  };

  // start catching all of actions and transitions
  middleware.use(Addon);

  return runtime(Addon);
})();

export default initializer;
