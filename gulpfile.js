var gulp          = require('gulp'),
	compass         = require('gulp-compass'),
	autoprefixer    = require('gulp-autoprefixer'),
	minifycss       = require('gulp-minify-css'),
	uglify          = require('gulp-uglify'),
	rename          = require('gulp-rename'),
	concat          = require('gulp-concat'),
	notify          = require('gulp-notify'),
	livereload      = require('gulp-livereload'),
	plumber         = require('gulp-plumber'),
  spawn           = require('child_process').spawn;
	path            = require('path');


//the title and icon that will be used for the Gulp notifications
var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

//error notification settings for plumber
var plumberErrorHandler = { errorHandler: notify.onError({
		title: notifyInfo.title,
		icon: notifyInfo.icon,
		message: "Error: <%= error.message %>"
	})
};

//styles
gulp.task('styles', function() {
	return gulp.src(['assets/scss/**/*.scss'])
		.pipe(plumber(plumberErrorHandler))
		.pipe(compass({
			css: 'assets/stylesheets',
			sass: 'assets/scss',
			image: 'assets/images',
			js: 'assets/javascripts',
      require: ['susy']
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(concat('main.css'))
		.pipe(gulp.dest('assets/build/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('assets/build/css'));
});

//scripts
gulp.task('scripts', function() {
	return gulp.src('assets/javascripts/**/*.js')
		.pipe(plumber(plumberErrorHandler))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('assets/build/js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('assets/build/js'));
});

//watch
gulp.task('live', function() {
	livereload.listen();

	//watch .scss files
	gulp.watch(['assets/scss/*.scss', 'assets/scss/**/*.scss'], ['styles']);

	//watch .js files
	gulp.watch('assets/js/**/*.js', ['scripts']);

	//reload when a template file, the minified css, or the minified js file changes
	gulp.watch(['templates/**/*.html', 'assets/build/css/main.min.css', 'assets/buil/js/main.min.js'], function(event) {
		gulp.src(event.path)
			.pipe(plumber())
			.pipe(livereload())
			.pipe(notify({
				title: notifyInfo.title,
				icon: notifyInfo.icon,
				message: event.path.replace(__dirname, '').replace(/\\/g, '/') + ' was ' + event.type + ' and reloaded'
			})
		);
	});
});

gulp.task('serve:backend', function () {
  var devServerPort = process.env.PORT || 8000;
  process.env.PYTHONUNBUFFERED = 1;
  process.env.PYTHONDONTWRITEBITECODE = 1;
  var child = spawn('python', ['manage.py', 'runserver', '0.0.0.0:' + devServerPort], {
      stdio: 'inherit'
  });
  process.on("uncaughtException", function() { process.kill(child.pid) });
});

// concat: js and css
// cssmin
// uglify js
// watch
// livereload

gulp.task('default', function() {
  gulp.start('serve:backend');
  //gulp.start('media:watch');
  gulp.start('live');
});
