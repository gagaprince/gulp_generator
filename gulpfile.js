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

var publishPath = 'dist';
var devWebpackPath = 'dist_webpack';

var currentPath = devWebpackPath;

gulp.task("css",function(cb){
    var cssDestPath = currentPath+'/css';
    return gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(cssDestPath))
        .pipe(rev.manifest())
        .pipe(gulp.dest(cssDestPath));
});

gulp.task("js",function(cb){
    var jsDestPath = currentPath+'/js';
    return gulp.src('src/js/*')
        .pipe(stripDebug())
        .pipe(stripComments())
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(jsDestPath))
        .pipe(rev.manifest())
        .pipe(gulp.dest(jsDestPath));
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
    var manifestPath = currentPath+'/**/*.json';
    var htmlDestPath = currentPath+'/';
    return gulp.src([manifestPath,'src/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css/': 'css/',
                'js/': 'js/'
            }
        }))
        .pipe(gulp.dest(htmlDestPath));
});


gulp.task("clean",function(cb){
    var cleanPath = currentPath+'/*';
    return gulp.src(cleanPath)
        .pipe(vinylPaths(del));
});

gulp.task("doc",function(cb){
    var config = require('./src/doc/jsdoc.json');
    gulp.src('src/js/*')
        .pipe(jsDoc(config,cb));
});


gulp.task("publish",function(cb){
    currentPath =publishPath;
    sequence('clean','js','css','html')(cb);
});

gulp.task("publish_webpack",function(cb){
    sequence('clean','js','css','html')(cb);
});

