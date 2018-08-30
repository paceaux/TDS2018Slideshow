var gulp = require('gulp'),
    concat = require('gulp-concat'),
    wrap = require('gulp-wrap'),
    replace = require('gulp-replace-task'),
    stylus = require('gulp-stylus'),
    Filter = require('gulp-filter'),
    nib = require('nib'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();


var sources = {
    slides: 'slides/*.html',
    styles: 'assets/css/*.styl',
    globalStyles: 'assets/styleImports/*.styl'
};

var serverUrl = 'tds2015.localhost'


gulp.task('browserSync', function () {
  browserSync.init({
    ui: {
        port: 9999
        },
    server: {
        baseDir: './'
    },
    files: [
        {
            match: ['assets/css/*.css', 'assets/js/*.js', 'slides/*.html']
        }
    ]
  });
});
gulp.task('globalStyles', function () {
    return gulp.src('assets/styleGlobals/*.styl')
    .pipe(concat('imports.styl'))
    .pipe(gulp.dest('assets/styleGlobals/'));
});

gulp.task('styles', function () {
    var filter = Filter(['assets/css/*.styl']);
    return gulp.src('assets/css/**/*.styl')
        .pipe(stylus({
            paths: ['assets/styleImports'],
            import: ['mixins.styl', 'vars.styl'],
            use: [nib()],
            compress: false,
        }))
        .pipe(autoprefixer())
        .pipe(concat('master.css'))
        .pipe(gulp.dest('assets/css/'));
});
gulp.task('slides', function () {
    return gulp.src(sources.slides)
        .pipe(wrap({src:'assets/templates/slide.html'}))

        .pipe(concat('presentation.html'))
        .pipe(wrap('<section class="slides"> <%=contents %> </section>'))
        .pipe(wrap({src: 'assets/templates/shell.html'}))
        .pipe(gulp.dest('./'));
});
gulp.task('serve', ['slides', 'styles', 'browserSync']);

gulp.task('default',['slides', 'styles'], function () {
    var watcher = gulp.watch(['assets/css/**/*.styl', 'slides/*.html'], ['styles','slides']);
    watcher.on('change', function(event) {
    });  
});