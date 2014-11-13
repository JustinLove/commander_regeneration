(function() {
  console.log('commander regeneration')

  var launcher = "/pa/commander_regeneration/commander_regen_launcher.json"
  var regenEvent = function(alert) {
    return ((alert.watch_type == constants.watch_type.death ||
             alert.watch_type == constants.watch_type.target_destroyed ||
             alert.watch_type == constants.watch_type.allied_death) &&
      alert.spec_id == launcher)
  }

  var liveGameWatchList = handlers.watch_list
  handlers.watch_list = function(payload) {
    //console.log(payload)
    if (!payload) return
    var events = []
    var alerts = []
    payload.list.forEach(function(alert) {
      if (regenEvent(alert)) {
        events.push(alert)
      } else {
        alerts.push(alert)
      }
    })

    if (events.length > 0) {
      payload.list = events
      api.Panel.message(api.Panel.parentId, 'commanderRegenerationEvents', payload); 
    }

    if (liveGameWatchList && alerts.length > 0) {
      payload.list = alerts
      liveGameWatchList(payload)
    }
  }
})()
