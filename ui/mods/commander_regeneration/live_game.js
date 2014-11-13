(function() {
  console.log('commander regeneration')

  var launcher = "/pa/commander_regeneration/commander_regen_launcher.json"

  var pasteUnits3D = function(config) {
    model.send_message('create_unit', config)
  }

  var regen = function(planet) {
    if (model.players().length < 1) return
    pasteUnits3D({
      army: model.players()[0].id,
      what: launcher,
      planet: planet,
      location: {x: 1, y: 0, z: 0}
    })
  }

  var event_s = ko.observable(5)
  var planets = ko.computed(function() {
    return model.celestialViewModels().length - 1
  })
  var event_ms = ko.computed(function() {
    if (planets() > 0) {
      return event_s() * 1000 / planets()
    } else {
      return event_s() * 1000
    }
  })

  var tick = function(planet) {
    var n = planets()
    if (n > 0) {
      regen(planet)
    }
    if (planet < n-1) {
      setTimeout(tick, event_ms(), planet + 1)
    } else {
      setTimeout(tick, event_ms(), 0)
    }
  }

  setTimeout(tick, event_ms(), 0)

  model.devMode(false)
  model.cheatAllowCreateUnit(false)
  model.sandbox(false)
})()

