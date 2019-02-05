/**
* MODULES
**/

const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const paths = {
   styles: {
       browsers: [
           'last 1 Edge version',
           'last 1 iOS version',
           'last 1 Safari version',
           'last 1 Samsung version',

           'last 1 Chrome version',
           'last 1 ChromeAndroid version',

           'last 1 Firefox version',
           'last 1 FirefoxAndroid version',

           'last 1 Opera version',
           'last 1 OperaMobile version'
       ],

       source: 'source/sass/style.scss'
   },

   scripts: {
       source: {
           custom: 'source/scripts/**/*.js',

           libraries: [
               'source/libraries/jquery-3.3.1.min.js',
               'source/libraries/cssua.min.js'
           ]
       }
   },

   html: {
       source: '*.html'
   },

   destination: 'public/assets'
};

/**
* EXPORTS
**/

exports.develop_scripts = develop_scripts;
exports.develop_styles = develop_styles;
exports.develop = develop;
exports.production_scripts = production_scripts;
exports.production_styles = production_styles;
exports.production = production;
exports.sync = sync;

/**
* FUNCTIONS
**/

function develop_scripts() {
   return (
       //concat javascript libraries
       gulp
       .src(paths.scripts.source.libraries)
       .pipe(sourcemaps.init())
       .pipe(concat('libraries.js'))
       .pipe(sourcemaps.write('/'))
       .pipe(gulp.dest(paths.destination)),

       //concat custom javascript
       gulp
       .src(paths.scripts.source.custom)
       .pipe(sourcemaps.init())
       .pipe(concat('scripts.js'))
       .pipe(sourcemaps.write('/'))
       .pipe(gulp.dest(paths.destination))
       .pipe(browserSync.stream())
   );
}

function develop_styles() {
   return (
       //compile and minify sass
       gulp
       .src(paths.styles.source)
       .pipe(sourcemaps.init())
       .pipe(sass())
       .on('error', sass.logError)

       .pipe(postcss([
           autoprefixer({
               browsers: paths.styles.browsers
           }),

           cssnano()
       ]))

       .pipe(sourcemaps.write('/'))
       .pipe(gulp.dest(paths.destination))
       .pipe(browserSync.stream())
   );
}

function develop() {
   return (
       develop_scripts(),
       develop_styles()
   );
}

function production_scripts() {
   return (
       //concat javascript libraries
       gulp
       .src(paths.scripts.source.libraries)
       .pipe(concat('libraries.js'))
       .pipe(gulp.dest(paths.destination)),

       //concat & minify custom javascript
       gulp
       .src(paths.scripts.source.custom)
       .pipe(concat('scripts.js'))
       .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(uglify())
       .pipe(gulp.dest(paths.destination))
   );
}

function production_styles() {
   return (
       //compile and minify sass
       gulp
       .src(paths.styles.source)
       .pipe(sass())
       .on('error', sass.logError)

       .pipe(postcss([
           autoprefixer({
               browsers: paths.styles.browsers
           }),

           cssnano()
       ]))

       .pipe(gulp.dest(paths.destination))
   );
}

function production() {
   return (
       production_scripts(),
       production_styles()
   );
}

function reload() {
   browserSync.reload();
}

function sync() {
   browserSync.init({
        proxy: "http://localhost:3000",
        files: paths.styles.source
   });

   gulp.watch(paths.scripts.source.custom, develop_scripts);
   gulp.watch(paths.styles.source, develop_styles);
   gulp.watch(paths.html.source, reload);
}