var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var ngConstant = require('gulp-ng-constant');
var util = require('gulp-util');
var protractorQA = require('gulp-protractor-qa');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');

// enviroment variables
var env = util.env.env || 'development';
var envPath = 'enviroments/' + env + '.json'
var proxyApiUrl = process.env.PROXY_API_URL || 'http://myproject.pow/api';

var paths = {
  css: ['./src/css/**/*.css'],
  js: ['./src/js/**/*.js'],
  img: ['./src/img/**/*'],
  fonts: ['./src/fonts/**/*'],
  html: ['./src/index.html', './src/templates/**/*.html'],
  sass: ['./scss/**/*.scss']
};

gulp.task('usemin', ['copy'], function() {
  return gulp.src('./src/index.html')
    .pipe(usemin({
      css: [minifyCss(), 'concat'],
      js: [uglify({mangle: false}), 'concat']
    }))
    .pipe(gulp.dest('./www/'))
});

gulp.task('sass', function(done) {
  gulp.src('./scss/*.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./src/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./src/css/'))
    .pipe(connect.reload())
    .on('end', done);
});

gulp.task('js', function(done) {
  gulp.src(paths.js)
    .pipe(connect.reload())
    .on('end', done);
});

gulp.task('css', function(done) {
  gulp.src(paths.css)
    .pipe(connect.reload())
    .on('end', done);
});

gulp.task('html', function(done) {
  gulp.src(paths.html)
    .pipe(connect.reload())
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.html, ['html']);
});

gulp.task('config', function () {
  gulp.src(envPath)
    .pipe(ngConstant({
      name: 'project.config'
    }))
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./src/js'));
});

gulp.task('server', function(){
  connect.server({
    root: ['src'],
    port: 9000,
    livereload: true,
    middleware: function(connect, o) {
      return [ (function() {
          var url = require('url');
          var proxy = require('proxy-middleware');
          var options = url.parse(proxyApiUrl);
          options.route = '/api';
          return proxy(options);
      })() ];
    }
  });
});

gulp.task('protractor-qa', function() {
    protractorQA.init({
        testSrc : [ 'test/specs/**/*_spec.js', 'test/pages/**/*_page.js'],
        viewSrc : [ 'www/index.html', 'www/templates/**/*.html' ]
    });
});

gulp.task('copy', ['sass'], function() {
  gulp.src(paths.html)
    .pipe(gulp.dest("./www/templates/"));

  gulp.src(paths.img)
    .pipe(gulp.dest("./www/img/"));

  gulp.src(paths.fonts)
    .pipe(gulp.dest("./www/fonts/"));

  //Copy Ionic libs
  gulp.src(["./src/bower_components/ionic/release/**"], {base: "./src/bower_components/ionic/release"})
    .pipe(gulp.dest("./www/bower_components/ionic/release/"));
});

gulp.task('default', ['watch', 'config', 'server', 'sass']);

gulp.task('build', ['sass', 'js', 'css', 'html', 'config', 'usemin', 'copy']);