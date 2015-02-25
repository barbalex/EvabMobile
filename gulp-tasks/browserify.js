/* browserify task
 ---------------
 Bundle javascripty things with browserify!

 If the watch task is running, this uses watchify instead
 of browserify for faster bundling using caching.
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var browserify   = require('browserify'),
    watchify     = require('watchify'),
    bundleLogger = require('../vendor/couchapp/_attachments/util/bundleLogger'),
    gulp         = require('gulp'),
    handleErrors = require('../vendor/couchapp/_attachments/util/handleErrors'),
    source       = require('vinyl-source-stream');

gulp.task('browserify', function () {
    var bundler,
        bundle;

    bundler = browserify({
        // Required watchify args
        cache: {},
        packageCache: {},
        fullPaths: true,
        // Specify the entry point of your app
        entries: ['./vendor/couchapp/_attachments/evab.js'],
        // Add file extentions to make optional in your requires
        extensions: ['.js'],
        // Enable source maps!
        debug: true
    });

    bundle = function () {
        // Log when bundling starts
        bundleLogger.start();

        return bundler
            .bundle()
            // Report compile errors
            .on('error', handleErrors)
            // Use vinyl-source-stream to make the
            // stream gulp compatible. Specifiy the
            // desired output filename here.
            .pipe(source('app.js'))
            // Specify the output destination
            .pipe(gulp.dest('./vendor/couchapp/_attachments/'))
            // Log when bundling completes!
            .on('end', bundleLogger.end);
    };

    if (global.isWatching) {
        bundler = watchify(bundler);
        // Rebundle with watchify on changes.
        bundler.on('update', bundle);
    }

    return bundle();
});