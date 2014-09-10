var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');

gulp.task('prod_style', function() {
    return gulp.src(['_attachments/style/jquery.mobile.css', '_attachments/style/themes/gruen.min.css', '_attachments/style/jquery.mobile.datebox.css', '_attachments/style/evab.css'])
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('_attachments/style'))
        .pipe(notify({message: 'prod_style task beendet'}));
});