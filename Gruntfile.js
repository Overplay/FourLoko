module.exports = function(grunt) {
    grunt.registerTask('init', 'install all the required packages through npm', function(){
        var exec = require('child_process').exec;
        var cb = this.async();

        exec('npm install', {cwd: '.'}, function(err, stdout, stderr) {
            console.log(stdout);
            exec('npm install', {cwd: './AmstelBrightSimulator'}, function(err, stdout, stderr){
                console.log(stdout);
                cb();
            });
        });
    });
}