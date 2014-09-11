'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');

gulp.task('dev_src_2', function() {
    return gulp.src(['vendor/couchapp/_attachments/markerclusterer.js', 'vendor/couchapp/_attachments/markerwithlabel.js', 'vendor/couchapp/_attachments/underscore.js'])
        .pipe(concat('main2.js'))
        .pipe(gulp.dest('vendor/couchapp/_attachments'))
        .pipe(notify({ message: 'dev_src_2 task beendet' }));
});