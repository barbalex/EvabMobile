/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp        = require('gulp'),
    requireDir  = require('require-dir'),
    runSequence = require('run-sequence');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('prod', function () {
    runSequence(
        ['browserify', 'prod_style', 'prod_src_1', 'prod_src_2']
    );
});