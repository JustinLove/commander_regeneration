var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.commander_regeneration/'
var stream = 'stable'
var media = require('./lib/path').media(stream)
var build = 'ui/main/shared/js/build.js'
var common = 'ui/main/shared/js/common.js'
var live_game = 'ui/mods/commander_regeneration/live_game.js'


module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    copy: {
      common: {
        files: [
          {
            src: media + common,
            dest: common,
          },
        ],
      },
      back: {
        files: [
          {
            src: modPath + live_game,
            dest: live_game,
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
              'pa/**',
              'server-script/**'],
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

  grunt.registerTask('hackCommon', 'Add mod hook to common.js', function() {
    var text = grunt.file.read(common)
    var ext = grunt.file.read('common_extensions.js')
    grunt.file.write(common, text + ext)
  })

  // Default task(s).
  grunt.registerTask('default', ['json_schema', 'jsonlint', 'copy:common', 'hackCommon', 'copy:mod']);

};

