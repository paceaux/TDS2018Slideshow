const gulp = require('gulp');
const config = require('../config');


function watchIt() {
 gulp.watch(config.styles.src,['styles']);
 gulp.watch(config.slides.src,['slides']);
}
gulp.task('watch', watchIt);