
function couchapp_load(scripts) {
  var x = 4; //wird benötigt, damit nativeMenu-Funktion nach jquery und vor jquery mobile zu liegen kommt
  for (var i=0; i < scripts.length - x; i++) {
    document.write('<script src="'+scripts[i]+'"><\/script>')
  };
  document.write('<script type="text/javascript">$(document).bind("mobileinit",function(){$.mobile.selectmenu.prototype.options.nativeMenu = false;});</script>');
  for (var i=x+1; i < scripts.length; i++) {
    document.write('<script src="'+scripts[i]+'"><\/script>')
  };
};

couchapp_load([
  "vendor/couchapp/jquery.js",
  "vendor/couchapp/jquery.couch.js",
  "vendor/couchapp/jquery.couch.app.js",
  "vendor/couchapp/jquery.couch.app.util.js",
  "vendor/couchapp/jquery.mustache.js",
  "vendor/couchapp/jquery.evently.js",
  "vendor/couchapp/jquery.mobile.js",
  "vendor/couchapp/phonegap.js",
  "vendor/couchapp/evab.js"
]);
