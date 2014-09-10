var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify');

gulp.task('prod_src_2', function() {
    return gulp.src(['vendor/couchapp/_attachments/markerclusterer.js', 'vendor/couchapp/_attachments/markerwithlabel.js', 'vendor/couchapp/_attachments/underscore.js'])
        .pipe(concat('main2.js'))
        .pipe(uglify())
        .pipe(gulp.dest('vendor/couchapp/_attachments'))
        .pipe(notify({ message: 'prod_src_2 task beendet' }));
});