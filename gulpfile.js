const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

function style() {
    return gulp.src('./dev/styles/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/styles'))
        .pipe(browserSync.stream());
}

function watch(){
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./dev/styles/**.*.scss', style);
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('./dev/scripts/**.*.js').on('change', browserSync.reload);    
}

exports.style = style;
exports.watch = watch;