module.exports = function (options) {
  return {
    init: require('./init')(options),
    build: require('./build')(options)
  };
};