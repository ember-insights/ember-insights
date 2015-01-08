export default {

  trackerPrefixedCommand: function(action, options) {
    options = options || {};
    return (options.trackerName ? options.trackerName + '.' : '') + action;
  }

};
