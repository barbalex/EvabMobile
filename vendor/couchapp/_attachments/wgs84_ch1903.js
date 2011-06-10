// Convert CH y/x to WGS lat
function CHtoWGSlat(y, x) {

  // Converts militar to civil and  to unit = 1000km
  // Axiliary values (% Bern)
  var y_aux = (y - 600000)/1000000;
  var x_aux = (x - 200000)/1000000;
  
  // Process lat
  lat = 16.9023892
       +  3.238272 * x_aux
       -  0.270978 * Math.pow(y_aux,2)
       -  0.002528 * Math.pow(x_aux,2)
       -  0.0447   * Math.pow(y_aux,2) * x_aux
       -  0.0140   * Math.pow(x_aux,3);
    
  // Unit 10000" to 1 " and converts seconds to degrees (dec)
  lat = lat * 100/36;
  
  return lat;
  
}

// Convert CH y/x to WGS long
function CHtoWGSlng(y, x) {

  // Converts militar to civil and  to unit = 1000km
  // Axiliary values (% Bern)
  var y_aux = (y - 600000)/1000000;
  var x_aux = (x - 200000)/1000000;
  
  // Process long
  lng = 2.6779094
        + 4.728982 * y_aux
        + 0.791484 * y_aux * x_aux
        + 0.1306   * y_aux * Math.pow(x_aux,2)
        - 0.0436   * Math.pow(y_aux,3);
     
  // Unit 10000" to 1 " and converts seconds to degrees (dec)
  lng = lng * 100/36;
     
  return lng;
  
}