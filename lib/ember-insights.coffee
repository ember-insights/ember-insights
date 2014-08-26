self = @

initializer =
  configure: (env, settings) =>
    # 0. assert settings
    # X. assign settings by particular environment
    @configs      ||= []
    @configs[env] = settings

  start: (env) =>
    @settings = @configs[env]
    Ember.assert("can't find settings for '#{env}' environment", @settings)
    # assert insights map
    Ember.assert("can't find 'insights' map for '#{env}' environment", @settings.insights)
    @settings.insights = Ember.Object.create(@settings.insights)
    # start catching events from ActionHandler and apply them w/ specified insights map
    Ember.ActionHandler.reopen
      send: @middleware

    @utils

# Some convenience as wrappers for extending the `window.ga` function
@utils =
  hasGA: ->
    window.ga and typeof window.ga is 'function'

  sendEvent: (category, action) ->
    if @hasGA()
      ga('send', 'event', category, action)
    else
      Ember.debug("Can't tsend event due to the `window.ga` is not a 'function'")

  trackPageView: (path, fieldNameObj) ->
    if @hasGA()
      fieldNameObj = {} unless fieldNameObj
      unless path
        loc  = window.location
        path = if loc.hash then loc.hash.substring(1) else loc.pathname + loc.search

      ga('send', 'pageview', path, fieldNameObj)
    else
      Ember.debug("Can't track page view due to the `window.ga` is not a 'function'")

@middleware = (actionName) ->
  # get active router
  router = @container.lookup('router:main').router
  if router
    # get the from route name
    routeName = router.currentHandlerInfos[router.currentHandlerInfos.length - 1].name

    # try to find out particular insight declaration
    match = (path, entity) ->
      self.settings.insights.getWithDefault(path, []).indexOf(entity) != -1
    # look for the insight declaration
    context = if (actionName is 'transition')
      #  inside 'transitions'
      a = match('transitions', routeName)
      b = match('transitions', routeName.replace('.index', ''))
      # inside 'map'
      c = match("map.#{routeName}.actions", 'transition')
      d = match("map.#{routeName.replace('.index', '')}.actions", 'transition')

      if (a || b || c || d) then { category: 'transition', action: routeName }
    else
      # inside 'actions'
      a = match('actions', actionName)
      # inside 'map'
      b = match("map.#{routeName}.actions", actionName)
      c = match("map.#{routeName.replace('.index', '')}.actions", actionName)

      if (a || b || c) then { category: 'action', action: actionName }
    # pass matched event to Google Analytic service
    self.utils.sendEvent(context.category, context.action) if context

  # drop a line to the developers console
  if self.settings.debug
    Ember.debug("TRAP: '#{actionName}' action from '#{routeName}' route")
    Ember.debug("TRAP MATCHED: '#{actionName}' action ") if context

  # bubble event back to the Ember engine
  @_super.apply(@, arguments)


`export default initializer`
