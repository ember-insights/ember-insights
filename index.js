/* jshint node: true */

var _defaultConfiguration = {
  googleAnalytics: {
    globalVariable: 'ga',
    webPropertyId: null,
    cookieDomain: null,
    cookieName: null,
    cookieExpires: null,
    displayFeatures: null,
    linkid: null
  }
};

function mergeConfiguration(defaultConfiguration, config) {
  var key;

  defaultConfiguration || (defaultConfiguration = {});
  config || (config = {});

  for (key in defaultConfiguration) {
    if (!defaultConfiguration.hasOwnProperty(key)) {
      continue;
    }

    if (!config[key]) {
      config[key] = defaultConfiguration[key];
    }
  }

  return config
}

function getGoogleAnalyticsTrackingCode(config) {
  var scriptArray, key, value, linkid = false, displayFeatures = false, gaConfig = {};

  for (key in config) {
    if (!config.hasOwnProperty(key)) {
      continue;
    }

    value = config[key];

    if (value === null) {
      continue;
    }

    if (key === 'linkid') {
      linkid = value;
      delete config[key];
    } else if (key === 'displayFeatures') {
      displayFeatures = value;
      delete config[key];
    }

    gaConfig[key] = config[key];
  }

  if (Object.keys(gaConfig).length === 0) {
    gaConfig = "'auto'";
  } else {
    gaConfig = JSON.stringify(gaConfig);
  }

  scriptArray = [
    "<script>",
    "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){",
    "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),",
    "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)",
    "})(window,document,'script','//www.google-analytics.com/analytics.js','" + config.globalVariable + "');",
    "",
    displayFeatures ? config.globalVariable + "('require', 'displayfeatures');" : "",
    linkid ? config.globalVariable + "('require', 'linkid', 'linkid.js');" : "",
    config.webPropertyId ? ("" + config.globalVariable + "('create', '" + config.webPropertyId + "', " + gaConfig + ");") : "",
    "</script>"
  ];

  return scriptArray;
}

module.exports = {
  name: 'ember-insights',

  contentFor: function (type, config) {
    var content = [], trackers, gaConfig;

    config.analyticsInsights || (config.analyticsInsights = {});
    trackers = config.analyticsInsights.trackers || (config.analyticsInsights.trackers = {});

    if (trackers.googleAnalytics) {
      gaConfig = mergeConfiguration(
        _defaultConfiguration.googleAnalytics,
        trackers.googleAnalytics || {}
      );

      var loadWithoutWebPropId = gaConfig.loadScriptWithoutWebPropertyId;
      if (typeof gaConfig.loadScriptWithoutWebPropertyId !== 'undefined') {
        delete gaConfig.loadScriptWithoutWebPropertyId;
      }
      if (type === 'head' && ((gaConfig.webPropertyId !== null) || loadWithoutWebPropId) ) {
        content = content.concat(getGoogleAnalyticsTrackingCode(gaConfig));
      }
    }

    return content.join("\n");
  }
};
