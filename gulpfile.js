var gulp = require('gulp'),
    concat = require('gulp-concat'),
    wrap = require('gulp-wrap'),
    replace = require('gulp-replace-task'),
    markdown = require('gulp-markdown'),
    stylus = require('gulp-stylus'),
    nib = require('nib');

var sources = {
    slides: 'slides/*.html',
    styles: 'assets/css/**/*.styl'
};
gulp.task('globalStyles', function () {
    return gulp.src('assets/styleGlobals/*.styl')
    .pipe(concat('imports.styl'))
    .pipe(gulp.dest('assets/styleGlobals/'))
});

gulp.task('styles', function () {
    return gulp.src(sources.styles)
        .pipe(concat('master.styl'))
        .pipe(stylus({
            compress: false,
            require: 'assets/styleGlobals/imports.styl'
        }))
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

gulp.task('default', function () {
    var watcher = gulp.watch(['assets/css/**/*.styl', 'slides/*.html'], [ 'globalStyles','styles','slides']);
    watcher.on('change', function(event) {
    });  
});