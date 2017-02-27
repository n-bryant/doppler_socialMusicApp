'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cache = require('gulp-cached');

var config = {
    srcSass: './src/styles/**/*.scss',
    srcJs: ['./src/js/*.js', './src/js/controllers/*.js', './src/js/services/*.js', './src/js/factories/*.js'],
    vendorJs: ['./src/js/vendor/angular.js', './src/js/vendor/angular-ui-router.js', './src/js/vendor/angular-local-storage.js'],
    production: !!util.env.production
};

/*
gulp tasks
*/
// sass
gulp.task('sass', function() {
    return gulp.src(config.srcSass)
        .pipe(sass(config.production ? {
            outputStyle: 'compressed'
        } : {}).on('error', sass.logError))
        .pipe(config.production ? concat('main.min.css') : util.noop())
        .pipe(gulp.dest('./lib/styles/'));
});

// js
gulp.task('js', function() {
    gulp.src(config.srcJs)
        .pipe(babel({
            presets: ['es2015']
        }))
        // concat only in production vs concat no matter what
        // .pipe(config.production ? concat('app.min.js') : util.noop())
        .pipe(concat('app.js'))
        .pipe(config.production ? uglify() : util.noop())
        .pipe(gulp.dest('./lib/js'));

    gulp.src(config.vendorJs)
        .pipe(cache('vendor-processing'))
        .pipe(uglify())
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('./lib/js/vendor'));
});

// watch
gulp.task('watch', function() {
    gulp.watch(config.srcSass, ['sass']);
    gulp.watch(config.srcJs, ['js']);
});

gulp.task('default', ['watch']);
