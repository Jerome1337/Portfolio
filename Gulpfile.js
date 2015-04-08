var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

var app = 'app/Resources';

var onError = function(err) {
    console.log(err);
};

gulp.task('Sass', function() {

    gulp.src(app + '/scss/**/*.scss')
        .pipe(plugins.plumber({
            errorHandler: onError
        }))
        .pipe(plugins.rubySass({
            compass: true,
            style: 'compressed',
            check: true}))
        .pipe(plugins.minifyCss({keepSpecialComments:0}))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('web/css/'));
});







gulp.task('watch', function() {
    gulp.watch(app + '/scss/**/*.scss', ['Sass']);
});


gulp.task('build', [


'Sass,'
]);

gulp.task('default', [
'Sass,'
]);
