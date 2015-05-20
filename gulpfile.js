var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require("gulp-rename");

gulp.task('styles', function(){
	return gulp.src([
		'assets/styles/main.sass',
		])
	  .pipe(sass({ indentedSyntax: true }))
	  .pipe(concat('app.css'))
	  .pipe(gulp.dest('public/css/'));
});

gulp.task('scripts', function() { 
    gulp.src([
			'bower_components/jquery/dist/jquery.min.js',
			'assets/scripts/singleplayer.js',
    	])
      .pipe(concat('singleplayer.js'))
      .pipe(gulp.dest('public/js/'));
      return gulp.src([
			'bower_components/jquery/dist/jquery.min.js',
			'assets/scripts/multiplayer.js',
    	])
      .pipe(concat('multiplayer.js'))
      .pipe(gulp.dest('public/js/'));
});

gulp.task('watch', function() {
    gulp.watch('assets/styles/**/*', ['styles']);
    gulp.watch('assets/scripts/**/*', ['scripts']);
});

gulp.task('update', function() {
    gulp.src('bower_components/jquery/dist/jquery.min.map').pipe(gulp.dest('public/js/'));
    return gulp.src('bower_components/normalize.css/normalize.css').pipe(rename('_normalize.scss')).pipe(gulp.dest('assets/styles/'));
});

gulp.task('default',['styles', 'scripts', 'watch']);