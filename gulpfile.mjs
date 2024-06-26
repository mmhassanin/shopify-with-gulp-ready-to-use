// import gulp from the node_modules folder
import gulp from 'gulp';
import concat from 'gulp-concat';
import prefix from 'gulp-autoprefixer';
import replace from 'gulp-replace';
import uglify from 'gulp-uglify';
import {deleteAsync} from 'del'; 
import browserSync from 'browser-sync';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

//Tasks
export const css = () => gulp
.src('src/css/main.scss')
.pipe(sass().on('error', sass.logError))
.pipe(concat('test.css.liquid'))
.pipe(prefix('last 2 version'))
.pipe(replace('/*!#','/*'))
.pipe(gulp.dest('test'))
.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
.pipe(replace('"\{\{', '{{'))
.pipe(replace('\}\}"', '}}'))
.pipe(concat('stylesheet.min.css.liquid'))
.pipe(replace('/*!--',''))
.pipe(replace('--*/',''))
.pipe(gulp.dest('theme-files/assets'))
.pipe(browserSync.stream()); //event - page reload to the listener in the server

export const js = () => gulp 
.src('src/js/main.js')
.pipe(uglify())
.pipe(concat('scripts.min.js.liquid'))
.pipe(gulp.dest('theme-files/assets'))
.pipe(browserSync.stream());

export const fontawesome = () => gulp
.src('src/css/font-awesome-pro.scss')
.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
.pipe(concat('fontawesome.min.css'))
.pipe(replace('../webfonts/',''))
.pipe(gulp.dest('theme-files/assets'))
.pipe(browserSync.stream());


export const copy = () => gulp
  .src([
    'src/fonts/**/*',
    'src/images/**/*'
  ])
  .pipe(gulp.dest('theme-files/assets')) //put it in dev
  .pipe(browserSync.stream({
    once: true //run only once
  }));


//server init
export const server = () => {
    browserSync.init({
        notify:true
    });
    gulp.watch('src/**/*.scss', css);
    gulp.watch('src/**/*.scss', fontawesome);
    gulp.watch('src/**/*.js', js);
}

//clears dist for dev and build
export const clear = (done) => {
    deleteAsync([path.dist.base], {
      force: true,
    });
    done();
  };

// repeating basic operations
export const base = gulp.parallel(css, fontawesome, js, copy);

// build build
export const build = gulp.series(clear, base);

// Build dev
export default gulp.series(base, server);

