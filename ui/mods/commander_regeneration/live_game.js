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

  var event_seconds = 5000

  var tick = function(planet) {
    regen(planet)
    setTimeout(tick, event_seconds, planet)
  }

  setTimeout(tick, event_seconds, 0)

  model.devMode(false)
  model.cheatAllowCreateUnit(false)
  model.sandbox(false)
})()

