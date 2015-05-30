'use strict'

var gulp = require('gulp'),
  requireDir = require('require-dir'),
  runSequence = require('run-sequence')

requireDir('../gulp-tasks', { recurse: true })

gulp.task('prod', function () {
  runSequence(
    ['browserify', 'prod_style', 'prod_src_1', 'prod_src_2']
  )
})
