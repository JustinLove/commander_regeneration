(scene_mod_list['live_game'] = scene_mod_list['live_game'] || []).
  unshift('coui://ui/mods/commander_regeneration/live_game.js');
(scene_mod_list['live_game_unit_alert'] = scene_mod_list['live_game_unit_alert'] || []).
  unshift('coui://ui/mods/commander_regeneration/live_game_unit_alert.js');

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
