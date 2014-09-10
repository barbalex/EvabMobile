var gulp = require('gulp');

return gulp.task('watch', function() {
    gulp.watch(['_attachments/*', 'vendor/couchapp/_attachments/*', '-vendor/couchapp/_attachments/main.js', '-vendor/couchapp/_attachments/main2.js', '-_attachments/style'], ['dev_src_1', 'dev_src_2']);
    gulp.watch(['_attachments/style/*', '-_attachments/style/main.css', '-_attachments/style/evab.min.css'], ['dev_style']);
});