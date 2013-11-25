module.exports = function (app) {
  require('./reactiveFns')(app);
  require('./viewFns')(app);
};