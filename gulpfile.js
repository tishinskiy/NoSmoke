'use strict';

const gulp = require('gulp');
const inlineCss = require('gulp-inline-css');
const less = require('gulp-less');
const pug = require('gulp-pug');
const del = require('del');
const browserSync = require('browser-sync').create();

gulp.task('clean', function() {
	return del(['public', 'interim']);
});

gulp.task('pug', function buildHTML() {
	return gulp.src('src/pug/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('./interim'));
});

gulp.task('less', function () {
	return gulp.src('./src/less/**/*.less')
		.pipe(less())
		.pipe(gulp.dest('./interim'));
});

gulp.task('email', function() {
	return gulp.src('interim/*.html')
		.pipe(inlineCss({
			removeHtmlSelectors: true
		}))
		.pipe(gulp.dest('public/'));
});

gulp.task('assets', function() {
	return gulp.src('src/images/**/*.*', {since: gulp.lastRun('assets')})
		.pipe(gulp.dest('public/images'));
});

gulp.task('assets-2', function() {
	return gulp.src('src/images/**/*.*', {since: gulp.lastRun('assets-2')})
		.pipe(gulp.dest('interim//images'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('pug', 'less', 'assets', 'assets-2'), 'email'));



gulp.task('watch', function() {
	gulp.watch('src/less/**/*.*', gulp.series('less','email'));
	gulp.watch('src/pug/**/*.*', gulp.series('pug','email'));
	gulp.watch('src/images/**/*.*', gulp.series('assets','email'));
});

gulp.task('serve', function() {
	browserSync.init({
		server: 'public'
	});

	browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
	gulp.series('build', gulp.parallel('watch', 'serve'))
);