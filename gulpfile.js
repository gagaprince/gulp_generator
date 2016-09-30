"use strict";
var gulp = require('gulp');
//var $ = require('gulp-load-plugins')(); //这个地方可以使用 $.less这种写法 代替 require引入 但是为了代码清晰 还是挨个 require
var less = require('gulp-less');
var cleanCss = require('gulp-clean-css');
var stripDebug = require('gulp-strip-debug');
var stripComments = require('gulp-strip-comments');
var htmlmin = require('gulp-htmlmin');
var jsDoc = require('gulp-jsdoc3');
var sequence = require('gulp-sequence');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

var connect = require('gulp-connect');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var webpack = require('gulp-webpack');


gulp.task("css",function(cb){
    return gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/css'));
});

gulp.task("webpack_css",function(cb){
    return gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest('dist_webpack/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist_webpack/css'));
});

gulp.task("js",function(cb){
    return gulp.src('src/js/*')
        .pipe(stripDebug())
        .pipe(stripComments())
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/js'));
});

gulp.task("webpack_js",function(cb){
    return gulp.src('src/js/entry/*')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist_webpack/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist_webpack/js'));
});

gulp.task("html",function(cb){
    return gulp.src(['dist/**/*.json','src/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css/': 'css/',
                'js/': 'js/'
            }
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task("webpack_html",function(cb){
    return gulp.src(['dist_webpack/**/*.json','src/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css/': 'css/',
                'js/': 'js/'
            }
        }))
        .pipe(gulp.dest('dist_webpack/'));
});

gulp.task("clean",function(cb){
    return gulp.src('dist/*')
        .pipe(vinylPaths(del));
});

gulp.task("clean_webpack",function(cb){
    return gulp.src('dist_webpack/*')
        .pipe(vinylPaths(del));
});

gulp.task("doc",function(cb){
    var config = require('./src/doc/jsdoc.json');
    gulp.src('src/js/*')
        .pipe(jsDoc(config,cb));
});


gulp.task("publish",function(cb){
    sequence('clean','js','css','html')(cb);
});

gulp.task("publish_webpack",function(cb){
    sequence('clean_webpack','webpack_js','webpack_css','webpack_html')(cb);
});

