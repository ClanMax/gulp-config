var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    nested = require('postcss-nested'),
    short = require('postcss-short'),
    connect = require('gulp-connect'),
    rimraf = require('gulp-rimraf'),
    autoprefixer = require('autoprefixer');

// build
var imagemin = require('gulp-imagemin'),
    purify = require('gulp-purifycss'),
    pngquant = require('imagemin-pngquant'),
    cssnano = require('cssnano');

gulp.task('css', function () {
    var processors = [
        autoprefixer({browsers: ['last 5 version']}),
        short(),
        nested(),
    ];
    return gulp.src('app/css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('dest/css'))
        .pipe(connect.reload());
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
    .pipe(gulp.dest('dest'))
    .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: 'dest',
    livereload: true
  });
});

gulp.task('watch', function () {
    gulp.watch(['dest/*.html'], ['html']);
    gulp.watch(['app/css/*.css'], ['css']);
});

// clean build
gulp.task('cleanBuildDir', function (cb) {
	rimraf('./build', cb);
});


//minify images
gulp.task('imgBuild', function () {
	return gulp.src('app/i/**/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('build/images/'));
});


//copy html
gulp.task('htmlBuild', function () {
	return gulp.src('app/**/*.html')
		.pipe(gulp.dest('build'));
});

// css build
gulp.task('cssBuild', function() {
    var processors = [
        autoprefixer({browsers: ['last 5 version']}),
        short(),
        nested(),
        cssnano()
    ];
    return gulp.src('app/css/*.css')
        .pipe(postcss(processors))
        // .pipe(purify(['app/**/*.html']))
        .pipe(gulp.dest('build/css'));
});


gulp.task('default', ['css', 'html', 'connect', 'watch']);
gulp.task('build',  function () {
	gulp.start('cleanBuildDir','imgBuild', 'htmlBuild', 'cssBuild');
});