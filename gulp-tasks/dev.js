/**
 * Baut das Projekt für die Entwicklung
 */

'use strict'

var gulp = require('gulp'),
  requireDir = require('require-dir'),
  runSequence = require('run-sequence')

requireDir('../gulp-tasks', {recurse: true})

gulp.task('dev', function () {
  runSequence(
    'browserify',
    ['dev_style', 'dev_src_1', 'dev_src_2'],
    'build_couchapp'
  )
})
