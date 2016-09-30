"use strict";
var gulp = require('gulp');
var less = require('gulp-less');
var stripCode = require('gulp-strip-code');
var cleanCss = require('gulp-clean-css');
var stripDebug = require('gulp-strip-debug');
var stripComments = require('gulp-strip-comments');
var beautify = require('gulp-beautify');
var concat = require('gulp-concat');
var csscomb = require('gulp-csscomb');
var exec = require('child_process').exec;
var gzip = require('gulp-gzip');
var htmlmin = require('gulp-htmlmin');
var jsDoc = require('gulp-jsdoc3');
var sequence = require('gulp-sequence');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
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
//        .pipe(csscomb())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/css'));
});

gulp.task("js",function(cb){
    return gulp.src('src/js/*')
        .pipe(stripCode({
            start_comment: "debug start",
            end_comment: "debug end"
        }))
        .pipe(stripDebug())
        .pipe(stripComments())
        .pipe(beautify({
            indentSize: 2
        }))
//        .pipe(concat('main.js'))
//        .pipe(gzip())
        .pipe(uglify())
        /*.pipe(rename({
            prefix: "",
            suffix: ".min",
            extname: ".js"
        }))*/
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
//        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/'));
});

gulp.task("clean",function(cb){
    exec('rm -rf dist');
    exec('rm -rf docs');
    cb();
});
gulp.task("doc",function(cb){
    var config = require('./src/doc/jsdoc.json');
    gulp.src('src/js/*')
        .pipe(jsDoc(config,cb));
});


gulp.task("publish",function(cb){
//   exec("gulp clean");
//   exec("gulp css");
//   exec("gulp js");
    //这里不能使用这种方式 因为 gulp命令执行是异步的
    sequence('clean','js','css','html')(cb);
});

