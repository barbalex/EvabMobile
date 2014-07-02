/**
 * Created by alex on 09.06.2014.
 */
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');

gulp.task('prod', ['prod_style', 'prod_src_1', 'prod_src_2']);

gulp.task('dev', ['dev_style', 'dev_src_1', 'dev_src_2']);

gulp.task('prod_style', function() {
    return gulp.src(['_attachments/style/jquery.mobile.css', '_attachments/style/themes/gruen.min.css', '_attachments/style/jquery.mobile.datebox.css', '_attachments/style/evab.css'])
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('_attachments/style'))
        .pipe(notify({message: 'prod_style task beendet'}));
});

gulp.task('dev_style', function() {
    return gulp.src(['_attachments/style/jquery.mobile.css', '_attachments/style/themes/gruen.min.css', '_attachments/style/jquery.mobile.datebox.css', '_attachments/style/evab.css'])
        .pipe(concat('main.css'))
        .pipe(gulp.dest('_attachments/style'))
        .pipe(notify({message: 'dev_style task beendet'}));
});

gulp.task('prod_src_1', function() {
    return gulp.src(['vendor/couchapp/_attachments/jquery.mobile.js', 'vendor/couchapp/_attachments/jquery.mobile.datebox.js', 'vendor/couchapp/_attachments/jquery.form.js', 'vendor/couchapp/_attachments/jquery.couch.js', 'vendor/couchapp/_attachments/evab.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('vendor/couchapp/_attachments'))
        .pipe(notify({ message: 'prod_src_1 task beendet' }));
});

gulp.task('dev_src_1', function() {
    return gulp.src(['vendor/couchapp/_attachments/jquery.mobile.js', 'vendor/couchapp/_attachments/jquery.mobile.datebox.js', 'vendor/couchapp/_attachments/jquery.form.js', 'vendor/couchapp/_attachments/jquery.couch.js', 'vendor/couchapp/_attachments/evab.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('vendor/couchapp/_attachments'))
        .pipe(notify({ message: 'dev_src_1 task beendet' }));
});

gulp.task('prod_src_2', function() {
    return gulp.src(['vendor/couchapp/_attachments/markerclusterer.js', 'vendor/couchapp/_attachments/markerwithlabel.js', 'vendor/couchapp/_attachments/underscore.js'])
        .pipe(concat('main2.js'))
        .pipe(uglify())
        .pipe(gulp.dest('vendor/couchapp/_attachments'))
        .pipe(notify({ message: 'prod_src_2 task beendet' }));
});

gulp.task('dev_src_2', function() {
    return gulp.src(['vendor/couchapp/_attachments/markerclusterer.js', 'vendor/couchapp/_attachments/markerwithlabel.js', 'vendor/couchapp/_attachments/underscore.js'])
        .pipe(concat('main2.js'))
        .pipe(gulp.dest('vendor/couchapp/_attachments'))
        .pipe(notify({ message: 'dev_src_2 task beendet' }));
});