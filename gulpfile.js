const { src, dest, watch, series, parallel } = require('gulp');

const del = require('del');
const sass = require('gulp-sass');
const auto = require('gulp-autoprefixer');
const babel = require("gulp-babel");
const pug = require('gulp-pug');
const sync = require('browser-sync');

const cssSass = () => {
  return src('./src/assets/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(auto({
      cascade: false
    }))
    .pipe(dest('./dist/assets/css/'))
}

const imgClean = (done) => {
  del(['./dist/assets/img/**/*']);
  done();
};

const copyImages = () => {
  return src('./src/assets/img/**')
  .pipe(dest('./dist/assets/img/'))
}

const cssPublic = (done) => {
  del(['./dist/assets/css/**/*']);
  done();
};

const copycss = () => {
  return src('./src/assets/css/**/*')
  .pipe(dest('./dist/assets/css/'))
}


const compilePug = () => {
  return src([ 'src/**/*.pug', '!src/**/_*.pug' ])
  .pipe(pug({
    pretty: true
  }))
  .pipe( dest( './dist/' ) );
}

const jsBabel = () => {
return src(['./src/assets/js/**/*.js', '!./src/assets/js/**/*.min.js'])
  .pipe(babel({
    presets: ['@babel/preset-env']  // gulp-babelでトランスパイル
  }))
  .pipe(dest('./dist/assets/js/'))
}

const copyMinjs = () => {
  return src('./src/assets/js/**/*.min.js')
  .pipe(dest('./dist/assets/js/'))
}

const syncFunc = () => {
  sync.init(syncOption);
}

const syncOption = {
  server: true,
  open: true,
  reloadOnStart: true,
  startPath: '/dist/',
  baseDir: '/dist/',
}

const syncReload = (done) => {
  sync.reload();
  done();
}

const watchFiles = () => {
  watch( './src/assets/sass/**/*.scss', series(cssSass, syncReload))
  watch( './src/assets/css/**/*', series(cssPublic ,copycss, syncReload))
  watch( './src/assets/img/', series(imgClean, copyImages, syncReload))
  watch( './src/**/*.pug', series(compilePug, syncReload))
  watch( './src/assets/js/**/*.js', series(jsBabel, syncReload))
  watch( './src/assets/js/**/*.min.js', series(copyMinjs, syncReload))
  watch( './dist/**/*.html', series(syncReload))
  watch( './dist/assets/js/**/*.js', series(syncReload))
}

exports.default = series(series(jsBabel, imgClean, copyImages, compilePug, cssPublic ,cssSass ,copycss ,copyMinjs), parallel(watchFiles, syncFunc));
