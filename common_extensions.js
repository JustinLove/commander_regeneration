(function() {
  var originalCall = engine.call
  engine.call = function(method) {
    if (method == 'unit.debug.paste') {
      console.log("Create unit disabled")
      return undefined;
    } else {
      return originalCall.apply(this, arguments);
    }
  }
})()
