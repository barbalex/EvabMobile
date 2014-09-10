var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('prod', ['browserify', 'prod_style', 'prod_src_1', 'prod_src_2']);