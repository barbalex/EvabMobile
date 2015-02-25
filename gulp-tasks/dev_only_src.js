/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp        = require('gulp'),
    requireDir  = require('require-dir'),
    runSequence = require('run-sequence');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('dev_only_src', function () {
    runSequence(
        'browserify',
        ['dev_src_1', 'dev_src_2']
    );
});