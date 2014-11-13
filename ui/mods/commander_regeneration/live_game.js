(function() {
  console.log('commander regeneration')

  var launcher = "/pa/commander_regeneration/commander_regen_launcher.json"
  var event_s = ko.observable(5)

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
  var baseEvent_ms = ko.computed(function() {
    if (planets() > 0) {
      return event_s() * 1000 / planets()
    } else {
      return event_s() * 1000
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
      return baseEvent_ms() / (targetEvents() - actualEvents())
    }
  })

  handlers.commanderRegenerationEvents = function(payload) {
    actualEvents(actualEvents() + payload.list.length)
    console.log('events', actualEvents(), targetEvents())
  }

  var tick = function(planet) {
    var n = planets()
    if (n > 0) {
      console.log('regen', actualEvents(), targetEvents(), wait_ms())
      regen(planet)
    }
    if (planet < n-1) {
      setTimeout(tick, wait_ms(), planet + 1)
    } else {
      setTimeout(tick, wait_ms(), 0)
    }
  }

  setTimeout(tick, baseEvent_ms(), 0)

  model.devMode(false)
  model.cheatAllowCreateUnit(false)
  model.sandbox(false)
})()

