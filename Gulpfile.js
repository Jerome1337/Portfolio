'use-strict';

/*
 * Folder path
 */

var appSrc = './app';
var appBuild = './dist';
var appTemp = './.tmp';

/*
 * Add Gulp and tools
 */
var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;
var cmq = require('gulp-combine-media-queries');
var minifyHTML = require('gulp-minify-html');
var csso = require('gulp-csso');
var concatCss = require('gulp-concat-css');

/*
 * Scripts
 */
gulp.task('script', function() {
    return gulp.src([
        appSrc + '/js/modernizr.js',
        appSrc + '/js/jquery-2.1.3.js',
        appSrc + '/js/foundation.min.js',
        appSrc + '/js/script.js'])
        .pipe(reload({
            stream: true,
            once: true
        }))
        // .pipe(gulp.dest( appBuild + '/js/' ))
        .pipe($.concat('script.js'))
        .pipe(gulp.dest( appTemp + '/js/' ))
        .pipe($.uglify())
        .pipe($.rename('script.min.js'))
        .pipe(gulp.dest( appTemp + '/js/' ))
        .pipe(gulp.dest( appBuild + '/js/' ))
        .pipe(gulp.dest( appSrc + '/js/' ))
        .pipe($.size({
            title: 'scripts'
        }))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

/*
 * Images
 */
gulp.task('images', function() {
    return gulp.src( appSrc + '/img/**/*.{jpg,jpeg,png,gif,svg}' )
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest( appBuild + '/img/' ))
        .pipe($.size({
            title: 'images'
        }));
});

/*
 * Copy All Files At The Root Level (app)
 */
gulp.task('copy', function() {
    return gulp.src([
            appSrc + '/.htaccess',
            appSrc + '/robots.txt',
            appSrc + '/humans.txt',
            appSrc + '/**/*.{appcache,tmp,wav,php,xml,json,ico,pdf}',
            appSrc + '/*.{appcache,tmp,wav,php,xml,json,ico,pdf}',
            appSrc + '/**/script.min.js',
            // appSrc + '/**/normalize.css',
            // appSrc + '/**/foundation.css',
            appSrc + '/**/style.min.css',
            appSrc + '/**/**/*.{jpg,jpeg,png,gif,svg}'
        ], {
            dot: true
        }).pipe(gulp.dest( appBuild ))
        .pipe($.size({
            title: 'copy'
        }));
});

/*
 * Fonts
 */
gulp.task('fonts', function() {
    return gulp.src( appSrc + '/font/**' )
        .pipe(gulp.dest( appBuild + '/font' ))
        .pipe($.size({
            title: 'font'
        }));
});

/*
 * Styles
 */
gulp.task('sass', function() {
    return gulp.src( appSrc + '/scss/*.scss' )
        .pipe($.changed('styles', {
            extension: '.scss'
        }))
        .pipe($.sass({
                includePaths: require('node-bourbon').includePaths
            })
            .on('error', console.error.bind(console))
        )
        .pipe($.autoprefixer({
            browsers: ['> 1%', 'last 10 versions', 'Firefox ESR', 'Opera 12.1'],
            cascade: true
        }))
        .pipe(gulp.dest( appTemp + '/css/' ))
        .pipe(gulp.dest( appSrc + '/css/' ))
        .pipe(cmq({log: true }));
});

gulp.task('concat-css', function(){
    return gulp.src([
        appSrc + '/css/normalize.css',
        appSrc + '/css/foundation.css',
        appSrc + '/css/styles.css'
        ])
        .pipe(concatCss("styles.css"))
        .pipe(gulp.dest( appSrc + '/css/' ))
});

gulp.task('css-minify', function() {
    return gulp.src( appSrc + '/css/styles.css')
        .pipe(csso())
        .pipe($.rename('style.min.css'))
        .pipe(gulp.dest( appTemp + '/css/' ))
        .pipe(gulp.dest( appSrc + '/css/' ))
        .pipe(gulp.dest( appBuild + '/css/' ))
        .pipe($.size({
            title: 'styles'
        }));
});

/*
 * HTML
 */
gulp.task('html', function() {
  var opts = {
    conditionals: true,
    spare:true,
    comments: false,
    empty: false,
    loose: false
  };
 
  return gulp.src( appSrc + '/*.html' )
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest( appBuild ));
});

/*
 * Clean
 */
gulp.task('clean', del.bind(null, [
    appTemp,
    appBuild
]));

/*
 * Upload FTP
 */
 gulp.task('ftp', function () {
    return gulp.src('./app/**/*')
        .pipe(ftp({
            host: 'ftp..com',
            user: '',
            pass: '',
            port: '21',
            remotePath: '/www/dev/'
        }))
        .pipe(gutil.noop());
});

/*
 * Watch and reload
 */
gulp.task('serve', ['build'], function() {
    browserSync({
        notify: false,
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        proxy: "http://portfolio:8888/"        
        //server: [ appTemp, appSrc]
    });
    gulp.watch( appSrc + '/**/*.php', reload);
    gulp.watch( appSrc + '/**/*.html', reload);
    gulp.watch( appSrc + '/scss/**/*.scss', ['watch-scss', reload]);
    // gulp.watch( appSrc + '/js/**/*.js', ['script', reload]);
    gulp.watch( appSrc + '/img/**/*', reload);
});

/*
 * Build and serve the output from the dist build
 */
gulp.task('watch-scss', function(cb) {
    runSequence('sass', 'concat-css', 'css-minify', cb);
});

/*
 * Build Production Files, the Default Task
 */
gulp.task('build', ['clean'], function(cb) {
    runSequence('html', 'watch-scss', ['script', 'images', 'fonts', 'copy'], cb);
});