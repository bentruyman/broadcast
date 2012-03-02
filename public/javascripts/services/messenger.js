define(function () {
  return new Faye.Client(window.location.origin + '/faye');
});