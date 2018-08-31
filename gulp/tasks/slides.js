const gulp = require('gulp');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');

const config = require('../config').slides;


function slides(cb) {
    gulp.src(config.src)
        .pipe(wrap(config.wrap))
        .pipe(concat(config.fileName))
        .pipe(wrap(config.slidesTemplate))
        .pipe(wrap({src: config.slidesShell}))
        .pipe(gulp.dest(config.dest));
    cb();
}

gulp.task('slides', slides);
