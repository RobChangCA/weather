const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

//a task to compile our sass
gulp.task('styles', () => {
  return gulp.src('./dev/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public/styles'))
    .pipe(reload({stream: true}));
});

//a task to compile our javascript
gulp.task('scripts', () => {
  return gulp.src('./dev/scripts/main.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./public/scripts'))
    .pipe(reload({stream: true}));
});

// a task to watch all other tasks
gulp.task('watch', ['styles', 'scripts', 'browser-sync'], function() {
  gulp.watch('./dev/scripts/**.js', ['scripts']);
  gulp.watch('./dev/styles/**.*.scss', ['styles']);
  gulp.watch('*.html', reload);
});
//browser sync
gulp.task('browser-sync', () => {
    browserSync.init({
        server: '.'
    });
});

gulp.task('default', ['styles', 'browser-sync', 'scripts'], () => {
    gulp.watch('./dev/styles/**/*.scss', ['styles']);
    gulp.watch('./dev/scripts/main.js'), ['scripts'];
     gulp.watch('*.html', reload);
});