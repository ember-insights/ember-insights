@configs ||= []

initializer =
  configure: (env, settings) =>
    # 0. assert settings
    # X. assign settings by particular environment
    @configs[env] = settings

  start: (env) =>
    settings = @configs[env]
    Ember.assert("can't find settings for '#{env}' environment", settings)

`export default initializer`
