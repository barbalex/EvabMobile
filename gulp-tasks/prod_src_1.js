/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');

gulp.task('prod_src_1', function () {
    return gulp.src([
        'vendor/couchapp/_attachments/jquery.mobile.js',
        'vendor/couchapp/_attachments/jquery.mobile.datebox.js',
        'vendor/couchapp/_attachments/jquery.form.js',
        'vendor/couchapp/_attachments/jquery.couch.js',
        'vendor/couchapp/_attachments/app.js'
    ])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('vendor/couchapp/_attachments'))
        .pipe(notify({ message: 'prod_src_1 task beendet' }));
});