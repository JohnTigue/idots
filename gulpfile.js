// This is IDOTS/gulpfile.js

(function(){

// Pull in all the toys    
var connect     = require('gulp-connect'),
    gulp        = require('gulp'),
    //lambda    = require('gulp-awslambda'),
    runSequence = require('run-sequence'), 
    serve       = require('gulp-serve');
    //zip       = require('gulp-zip');

/* Default: build and serve
 */
gulp.task('default', function(aCallback) {
  // https://egghead.io/lessons/angularjs-angular-automation-gulp-serve  
  runSequence( 'build', 'serve', aCallback );
  });

gulp.task('serve', serve('src/apps/omolumeter'));
    
/* Basic dev server "watch, connect, live refresh" combo
 * http://stephenradford.me/gulp-angularjs-and-html5mode/
 */
gulp.task('DEADserve', function() {
    connect.server({
      root: 'src/apps/omolumeter/',
      port: 4500,
      WAShost: '192.168.1.101',
      fallback: '/index.html'
    });
  });

    
/* Send static content to S3/CloudFront
 */
gulp.task('publish', function() {
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property 

  // create a new publisher using S3 options 
  var publisher = awspublish.create({
    region: 'your-region-id',
    params: {
      Bucket: '...'
    }
  }, {
    cacheFile: 'your-cache-location'
  });
 
  // define custom headers 
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
    // ... 
  };
 
  return gulp.src('./public/*.js')
     // gzip, Set Content-Encoding headers and add .gz extension 
    .pipe(awspublish.gzip({ ext: '.gz' }))
 
    // publisher will add Content-Length, Content-Type and headers specified above 
    // If not specified it will set x-amz-acl to public-read by default 
    .pipe(publisher.publish(headers))
 
    // create a cache file to speed up consecutive uploads 
    .pipe(publisher.cache())
 
     // print upload updates to console 
    .pipe(awspublish.reporter());
  });
 
// output 
// [gulp] [create] file1.js.gz 
// [gulp] [create] file2.js.gz 
// [gulp] [update] file3.js.gz 
// [gulp] [cache]  file3.js.gz 
    // ...


gulp.task('build', function(){
  console.log('TODO: build is TBD')
  });
    
/* Package up a service distro and pump up ot AWS S3 
 * https://www.npmjs.com/package/gulp-awslambda
 *
 * JFT-TODO: clearly this will evolve to build and the separate tasks for distToS3 and distToLambda; maybe serverless framework?
 */
gulp.task('buildToLambda', function() {
  return gulp.src('index.js')
  .pipe(zip('archive.zip'))
  .pipe(lambda(lambda_params, opts))
  .pipe(gulp.dest('.'));
});


}());

