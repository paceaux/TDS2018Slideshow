const gulp = require('gulp');
const config = require('../config').browserSync;

const browserSync = require('browser-sync').create();


gulp.task('browserSync', () => {
    browserSync.init(config);
});