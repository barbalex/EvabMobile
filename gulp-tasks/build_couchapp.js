'use strict'

var gulp = require('gulp'),
  shell = require('gulp-shell'),
  pass_file = require('../couchpass.json'),
  userName,
  password,
  request

userName = pass_file.user
password = pass_file.pass

request = 'couchapp push http://' + userName + ':' + password + '@127.0.0.1:5984/evab'

gulp.task('build_couchapp', shell.task([request]))
