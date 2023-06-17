var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.commander_regeneration/'
var stream = 'stable'
var media = require('./lib/path').media(stream)

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    copy: {
      mod: {
        files: [
          {
            src: [
              'modinfo.json',
              'LICENSE.txt',
              'README.md',
              'CHANGELOG.md',
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
    clean: ['pa/units', 'pa/tools', modPath],
    // copy files from PA, transform, and put into mod
    proc: {
      commander: {
        targets: [
          'pa/units/commanders/**/*.json',
          'pa_ex1/units/commanders/**/*.json',
          '!pa/units/commanders/base_commander/base_commander_*.json',
          '!pa/units/commanders/avatar/*.json',
          '!pa/units/commanders/commander_list.json',
          '!pa_ex1/units/commanders/base_commander/base_commander_*.json',
          '!pa_ex1/units/commanders/avatar/*.json',
          '!pa_ex1/units/commanders/commander_list.json',
        ],
        process: function(spec) {
          if (spec.tools) {
            spec.tools.push( {
              "aim_bone": "bone_root", 
              "fire_event": "fired3",
              "record_index": -1, 
              "spec_id": "/pa/commander_regeneration/commander_regen_tool.json"
            })
          }
        }
      },
      regen_tool: {
        src: [
          'pa_ex1/units/land/titan_structure/titan_structure_tool_weapon.json'
        ],
        cwd: media,
        dest: 'pa/commander_regeneration/commander_regen_tool.json',
        process: function(spec) {
          console.log(spec)
          spec.ammo_id = '/pa/commander_regeneration/commander_regen_ammo.json'
          spec.fire_delay = 0
          spec.ammo_capacity = 0
          spec.ammo_per_shot = 0
          delete spec.only_fire_once
          return spec
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-json-schema');

  grunt.registerMultiTask('proc', 'Process unit files into the mod', function() {
    if (this.data.targets) {
      var specs = spec.copyPairs(grunt, this.data.targets, media)
      spec.copyUnitFiles(grunt, specs, this.data.process)
    } else {
      var specs = this.filesSrc.map(function(s) {return grunt.file.readJSON(media + s)})
      var out = this.data.process.apply(this, specs)
      grunt.file.write(this.data.dest, JSON.stringify(out, null, 2))
    }
  })

  grunt.registerTask('printPath', function() {
    console.log(media)
  });

  // Default task(s).
  grunt.registerTask('default', ['proc', 'jsonlint', 'json_schema', 'copy:mod','printPath']);

};

