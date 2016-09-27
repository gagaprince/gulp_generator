"use strict";
var gulp = require('gulp');
var less = require('gulp-less');
var stripCode = require('gulp-strip-code');
var cleanCss = require('gulp-clean-css');
var stripDebug = require('gulp-strip-debug');
var stripComments = require('gulp-strip-comments');

gulp.task("css",function(){
    gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task("js",function(){
    gulp.src('src/js/*')
        .pipe(stripCode({
            start_comment: "debug start",
            end_comment: "debug end"
        }))
        .pipe(stripDebug())
        .pipe(stripComments())
        .pipe(gulp.dest('dist/js'));
});

