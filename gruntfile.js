module.exports = function(grunt) {
  grunt.initConfig({
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        options: {
          singleRun: false
        }
      }
    },

    babel: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'public/js/indexes5.js': 'public/js/index_es6.js'
            }
        }
    },

  });
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-babel');
  grunt.registerTask('testing', ['karma:unit']);
  grunt.registerTask('babelTranspiler', ['babel']);
  grunt.registerTask('server', 'Start server', function() {
       var app = require('./app.js');
    });


  grunt.registerTask('default',['server','babel','karma:unit']);

};
