(function() {
  console.log('commander regeneration')

  var launcher = "/pa/commander_regeneration/commander_regen_launcher.json"
  var event_s = ko.observable(3)
  var simulatePlayers = 1

  var pasteUnits3D = function(config) {
    model.send_message('create_unit', config)
  }

  var regen = function(planet) {
    if (model.players().length < 1) return
    pasteUnits3D({
      army: model.player().id || model.players()[0].id,
      what: launcher,
      planet: planet,
      location: {x: 1, y: 0, z: 0}
    })
  }

  var baselineDefined = false
  var baseline = ko.observable(0)
  var endOfTime = ko.observable(0)
  var liveGameTime = handlers.time
  handlers.time = function(payload) {
    endOfTime(payload.end_time)
    if (!baselineDefined) {
      baselineDefined = true
      baseline(payload.end_time)
    }
    //console.log(time)
    if (liveGameTime) liveGameTime(payload)
  }
  var transpired = ko.computed(function() {
    return endOfTime() - baseline()
  })

  var planets = ko.computed(function() {
    return model.celestialViewModels().length - 1
  })
  var connectedClient = function(player) {
    return player.ai == 0 && player.disconnected == false
  }
  var numberOfPlayers = function(player) {return player.slots.length}
  var sum = function(a, b) {return a + b}
  var players = ko.computed(function() {
    var n = model.players().filter(connectedClient).map(numberOfPlayers).reduce(sum, 0)
    if (simulatePlayers > 0) {
      return simulatePlayers
    } else if (n > 0) {
      return n
    } else {
      return 1
    }
  })
  var baseEvent_ms = ko.computed(function() {
    if (planets() > 0) {
      return event_s() * players() * 1000 / planets()
    } else {
      return event_s() * players() * 1000
    }
  })
  var targetEventRate = ko.computed(function() {
    if (planets() > 0) {
      return planets() / event_s()
    } else {
      return 0
    }
  })

  var targetEvents = ko.computed(function() {
    return transpired() * targetEventRate()
  })
  var actualEvents = ko.observable(0)
  var wait_ms = ko.computed(function() {
    if (actualEvents() >= targetEvents()) {
      return baseEvent_ms() * (actualEvents() - targetEvents() + 1)
    } else {
      return baseEvent_ms() / (targetEvents() - actualEvents() + 1)
    }
  })
  var fuzz = function(n) {
    return 2 * n * Math.random()
  }

  handlers.commanderRegenerationEvents = function(payload) {
    actualEvents(actualEvents() + payload.list.length)
    console.log('events', actualEvents(), targetEvents())
  }

  var tick = function() {
    if (planets() > 0) {
      var planet = Math.floor(Math.random() * planets())
      console.log('regen', actualEvents(), targetEvents(), wait_ms(), planet)
      regen(planet)
    }
    setTimeout(tick, fuzz(wait_ms()))
  }

  for (var i = 0;i < simulatePlayers;i++) {
    setTimeout(tick, fuzz(baseEvent_ms()))
  }

  model.devMode(false)
  model.cheatAllowCreateUnit(false)
  model.sandbox(false)
})()

