var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.commander_regeneration/'
var stream = 'stable'
var media = require('./lib/path').media(stream)
var build = 'ui/main/shared/js/build.js'
var live_game = 'ui/mods/commander_regeneration/live_game.js'
var live_game_unit_alert = 'ui/mods/commander_regeneration/live_game_unit_alert.js'


module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    copy: {
      back: {
        files: [
          {
            src: modPath + live_game,
            dest: live_game,
          },
          {
            src: modPath + live_game_unit_alert,
            dest: live_game_unit_alert,
          },
        ],
      },
      mod: {
        files: [
          {
            src: [
              'modinfo.json',
              'LICENSE.txt',
              'README.md',
              'CHANGELOG.md',
              'ui/**',
              'pa/**'],
            dest: modPath,
          },
        ],
      },
    },
    jsonlint: {
      all: {
        src: [
          'pa/**/*.json'
        ]
      },
    },
    json_schema: {
      all: {
        files: {
          'lib/schema.json': [
            'pa/**/*.json'
          ]
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-json-schema');

  // Default task(s).
  grunt.registerTask('default', ['json_schema', 'jsonlint', 'copy:mod']);

};

