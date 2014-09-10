var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('dev', ['browserify', 'dev_style', 'dev_src_1', 'dev_src_2'], function() {
    gulp.start('watch');
});