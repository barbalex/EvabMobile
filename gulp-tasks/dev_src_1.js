'use strict'

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify')

gulp.task('dev_src_1', function () {
  return gulp.src([
    'vendor/couchapp/_attachments/jquery.mobile.js',
    'vendor/couchapp/_attachments/jquery.mobile.datebox.js',
    'vendor/couchapp/_attachments/jquery.form.js',
    'vendor/couchapp/_attachments/jquery.couch.js',
    'vendor/couchapp/_attachments/app.js'
  ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('vendor/couchapp/_attachments'))
    .pipe(notify({ message: 'dev_src_1 task beendet' }))
})
