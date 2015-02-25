/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');

gulp.task('dev_style', function () {
    return gulp.src([
        '_attachments/style/jquery.mobile.css',
        '_attachments/style/themes/gruen.min.css',
        '_attachments/style/jquery.mobile.datebox.css',
        '_attachments/style/evab.css'
    ])
        .pipe(concat('main.css'))
        .pipe(gulp.dest('_attachments/style'))
        .pipe(notify({message: 'dev_style task beendet'}));
});