// TODO: consider using an ES5 shim
(function (undefined) {
  // application namespace
  var Broadcast = this.Broadcast = {};
  
  // weld application instance
  Broadcast.App = new Weld.App({
    defaultServices: ['api', 'query', 'template', 'utils'],
    paths: { base: '/javascripts' }
  });
}());
