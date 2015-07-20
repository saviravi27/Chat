module.exports = function(grunt) {
  grunt.initConfig({
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        options: {
          singleRun: false
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-karma');
  grunt.registerTask('hello', ['karma:unit']);
};

//   grunt.initConfig({
//   "babel": {
//     options: {
//       sourceMap: true
//     },
//     dist: {
//       files: {
//         "dist/helloWorld.js": "src/helloWorld.js"
//       }
//     }
//   }
// });

// grunt.registerTask("babel", ["babel"]);
