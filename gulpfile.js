/**
 * Created by station4 on 9/05/2016.
 */


var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var ftp = require( 'vinyl-ftp' );


gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
    }))
});

gulp.task('watch', ['browserSync' , 'sass'] , function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/**/*.js', browserSync.reload);
});




gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app',
            index: 'work.html'
        }
    })
});



gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js' , uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});



gulp.task('move', function () {
    return gulp.src('app/*.+(pdf|php)')
        .pipe(gulp.dest('dist'))
});





gulp.task( 'fileUpload', function () {

    var conn = ftp.create( {
        host:     'ftp.davidberrydev.com',
        user:     'david@davidberrydev.com',
        password: 'Vonswilly3!',
        parallel: 10,
        log:      gutil.log
    } );

    var globs = [
        'dist/**'
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, { base: './dist/', buffer: false } )
        .pipe( conn.newer( '/examples/CT' ) ) // only upload newer files
        .pipe( conn.dest( '/examples/CT' ) );

} );





gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg|mp4)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
});







gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'], 'move',
        callback
    )
});

gulp.task('launch', function (callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'], 'move','fileUpload',
        callback
    )
});


gulp.task('default', function (callback) {
    runSequence(['sass','browserSync', 'watch'],
        callback
    )
});