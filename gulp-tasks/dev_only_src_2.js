'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('dev_only_src_2', ['dev_src_1', 'dev_src_2']);