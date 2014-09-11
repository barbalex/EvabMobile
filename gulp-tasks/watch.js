var gulp = require('gulp');

return gulp.task('watch', function() {
    gulp.watch(
        [
            '_attachments/*',
            '-_attachments/style',
            'vendor/couchapp/_attachments/*',
            '-vendor/couchapp/_attachments/main.js',
            '-vendor/couchapp/_attachments/main2.js',
            '-vendor/couchapp/_attachments/app.js',
            'vendor/couchapp/_attachments/modules/*',
            'vendor/couchapp/_attachments/util/*'
        ],
        ['dev_src_1', 'dev_src_2']
    );
    gulp.watch(
        [
            '_attachments/style/*',
            '-_attachments/style/main.css',
            '-_attachments/style/evab.min.css'
        ],
        ['dev_style']
    );
    // browserify soll wissen, das gewatched wird
    global.isWatching = true;
});