'use strict';

var gulp = require('gulp'),
    shell = require('gulp-shell');

return gulp.task('build_couchapp', shell.task(['couchapp push http://barbalex:dLhdMg12@127.0.0.1:5984/evab']));