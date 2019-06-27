const gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create(),
    concat = require("gulp-concat"),
    minify = require("gulp-minify"),
    babel = require('gulp-babel');

function style() {
    return gulp.src('./dev/styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/styles'))
        .pipe(browserSync.stream());
}

function script(){
    return gulp.src('./dev/scripts/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(concat("index.js"))
    .pipe(minify({noSource: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/scripts'))
    .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./dev/styles/**/*.scss', style);
    gulp.watch('./dev/scripts/**/*.js', script);
    gulp.watch('./*.html').on('change', browserSync.reload);
}

exports.style = style; 
exports.script = script;
exports.watch = watch;
