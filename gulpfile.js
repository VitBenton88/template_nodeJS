//modules
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const uglifyjs = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const pump = require('pump');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const livereload = require('gulp-livereload');

//paths
const paths = {
  cssLibSrc: 'src/libs/**/*.css',
  jsLibSrc: 'src/libs/**/*.js',
  root: '/',
  src: 'public/assets',
  scripts: 'src/js/*.js',
  sass: 'src/sass/**/*.scss',
  sassSrc: 'src/sass/style.scss'
};

//// DEVELOPMENT gulp.tasks ////

// combine css libraries - DEVELOPMENT
function librariesCssDevelopment(cb) {
  pump([
    gulp.src(paths.jsLibSrc),
    sourcemaps.init(),
    concat('lib.min.js'),
    sourcemaps.write(paths.root),
    gulp.dest(paths.src)
  ],
  cb()
  );
}

// combine js libraries - DEVELOPMENT
function librariesJsDevelopment(cb) {
  pump([
    gulp.src(paths.jsLibSrc),
    sourcemaps.init(),
    concat('lib.min.js'),
    sourcemaps.write(paths.root),
    gulp.dest(paths.src)
  ],
  cb()
  );
}

// concat custom js - DEVELOPMENT
function scriptsDevelopment(cb) {
  pump([
    gulp.src(paths.scripts),
    sourcemaps.init(),
    concat('all.min.js'),
    sourcemaps.write(paths.root),
    gulp.dest(paths.src)
  ],
  cb
  );
}

//compile sass - DEVELOPMENT
function sassDevelopment(cb) {
  gulp.src(paths.sassSrc)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write(paths.root))
    .pipe(gulp.dest(paths.src))
    .pipe(livereload());
  cb();
}

//// PRODUCTION gulp.tasks/ ////

// combine css libraries - PRODUCTION
function librariesCssProduction(cb) {
  pump([
    gulp.src(paths.cssLibSrc),
    concat('lib.min.css'),
    gulp.dest(paths.src)
  ],
  cb
);
}

// combine js libraries - PRODUCTION
function librariesJsProduction(cb) {
  pump([
    gulp.src(paths.jsLibSrc),
    concat('lib.min.js'),
    gulp.dest(paths.src)
  ],
  cb
);
}

// minify & concat custom js - PRODUCTION
function scriptsProduction(cb) {
  pump([
    gulp.src(paths.scripts),
    concat('all.min.js'),
    uglifyjs(),
    gulp.dest(paths.src)
  ],
  cb
);
}

//compile sass - PRODUCTION
function sassProduction(cb) {
  gulp.src(paths.sassSrc)
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.src));
  cb();
}

//setup watch gulp task
function watch() {
  //live reloader
  livereload.listen();
  //watch for changes in js
  gulp.watch(paths.scripts, scriptsDevelopment);
  //watch for changes in sass
  gulp.watch(paths.sass, sassDevelopment);
}

//assign to gulp tasks
gulp.task('default', gulp.series(librariesCssDevelopment, librariesJsDevelopment, scriptsDevelopment, sassDevelopment));
gulp.task('production', gulp.series(librariesCssProduction, librariesJsProduction, scriptsProduction, sassProduction));
gulp.task('watch', gulp.series(watch));