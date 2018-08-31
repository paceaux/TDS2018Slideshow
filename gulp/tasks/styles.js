const gulp = require('gulp');
const concat = require('gulp-concat');
const stylus = require('gulp-stylus');

const config = require('../config').styles;

gulp.task('styles', () => {
    return gulp.src(config.src)
        .pipe(stylus(config.stylus))
        .pipe(concat(config.fileName))
        .pipe(gulp.dest(config.dest));
})