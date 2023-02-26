var gulp          = require('gulp');
//var sass          = require('gulp-sass');
const path = require('path');
var browserSync   = require('browser-sync').create();
var webpackStream =require('webpack-stream');
var webpack2      = require('webpack');

var concat = require('gulp-concat');

//sass.compiler = require('dart-sass');


let webpackConfig = {
  module: {
    rules: [
      {
        test: /\.js$|jsx/, 
        use: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },{
        test: /\.(jpe?g|png|gif|svg|tga|glb|babylon|mtl|pcb|pcd|prwm|obj|mat|mp3|ogg|fbx)$/i,
        use: 'file-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      }
    ]
  }
};


function javascript() {
  return gulp.src("app.js")
    .pipe(webpackStream(webpackConfig, webpack2))
    .on('error', (err) => {
      console.log(err.message);
      //this.emit('end'); // Recover from errors
    })


    .pipe(concat('app.js'))    //.pipe(concat('app.js'))
    // .pipe($.sourcemaps.init())
    // .pipe($.if(PRODUCTION, $.uglify()
    //   .on('error', e => { console.log(e); })
    // ))
    // .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest('dist'));
}


function serve() {
  browserSync.init({
    server: './'
  });

  //gulp.watch("app/js/*.js", javascript);
  gulp.watch("app.js").on('change', gulp.series(javascript, browserSync.reload));
  gulp.watch('index.html').on('change', browserSync.reload)
  gulp.watch("*.css", css);
  // gulp.watch("**/*.scss", sass);
  //gulp.watch("*.php").on('change', browserSync.reload);
}

// function sass() {
//   return gulp.src('*.scss')
//     .pipe(sass())
//     .on('error', (err) => {
//       console.log(err.message);
//       //this.emit('end'); // Recover from errors
//     })
//     .pipe(gulp.dest('dist'))
//     .pipe(browserSync.stream());
// }


function css() {
  return gulp.src('*.css')
    //.pipe(sass())
    // .on('error', (err) => {
    //   console.log(err.message);
    //   this.emit('end'); // Recover from errors
    // })
    //.pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}


gulp.task('javascript', javascript);
//gulp.task('sass', sass);

// gulp.task('serve', gulp.series('sass',serve));
gulp.task('default', serve);
