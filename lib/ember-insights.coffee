@configs ||= []

initializer =
  configure: (env, settings) =>
    # 0. assert settings
    # X. assign settings by particular environment
    @configs[env] = settings

  start: (env) =>
    settings = @configs[env]
    Ember.assert("can't find settings for '#{env}' environment", settings)
    # catch events from ActionHandler and apply them w/ specified insights
    Ember.ActionHandler.reopen
      send: @middleware

@middleware = (actionName) ->
  # get active router
  # router = if @target then @target.router else @get('controller.target.router')
  router = @container.lookup('router:main').router
  unless router
    # bubble event back to the engine
    @_super.apply(@, arguments)
    return

  activeTransition    = router.activeTransition && router.activeTransition.targetName
  activeLeafMostRoute = router.currentHandlerInfos[router.currentHandlerInfos.length - 1].name

  # fetch the correct analytics route handler object from the lookup table based on the following, in order:
  #   1. if currently transitioning to a route, get that new route's handler
  #   2. otherwise, get the active leaf-most route handler
  #   3. if either of those do not resolve, look in _global
  #   4. finally, if none resolve, then there will be no tracking
  routeName = activeTransition || activeLeafMostRoute

  console.log(actionName)

`export default initializer`
