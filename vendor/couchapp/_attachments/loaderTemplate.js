
function couchapp_load(scripts) {
  for (var i=0; i < scripts.length; i++) {
    document.write('<script src="'+scripts[i]+'"><\/script>')
  };
};

couchapp_load([
  "../../vendor/couchapp/jquery-1.6.1.js",
  "../../vendor/couchapp/jquery.couch.js",
  "../../vendor/couchapp/jquery.couch.app.js",
  "../../vendor/couchapp/jquery.couch.app.util.js",
  "../../vendor/couchapp/jquery.mustache.js",
  "../../vendor/couchapp/jquery.evently.js",
  "../../vendor/couchapp/jquery.mobile-1.0a4.1.js",
  "../../vendor/couchapp/phonegap.js",
  "../../vendor/couchapp/jquery.mobile.actionsheet.js",
  "../../vendor/couchapp/evab.js"
]);
