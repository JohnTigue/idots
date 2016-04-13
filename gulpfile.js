var gulp = require('gulp'); 
var connect = require('gulp-connect');

// http://stephenradford.me/gulp-angularjs-and-html5mode/
gulp.task('serve', function() {
    connect.server({
      WASroot: 'public',
      port: 4500,
      WAShost: '192.168.1.101',
      fallback: 'src/apps/omolumeter/index.html'
    });
});
