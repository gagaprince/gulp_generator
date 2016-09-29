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
gulp.task("clean_js",function(cb){
//    exec('rm -rf dist/js');
//    del(['dist/js/*'],cb);
//    cb();
    return gulp.src('dist/js/*')
        .pipe(vinylPaths(del));
});
gulp.task("clean_css",function(cb){
//    exec('rm -rf dist/css');
//    cb();
//    del(['dist/css/*'],cb);
    return gulp.src('dist/css/*')
        .pipe(vinylPaths(del));
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

gulp.task("html_reload",function(cb){
    return gulp.src(['dist/**/*.json','src/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css/': 'css/',
                'js/': 'js/'
            }
        }))
//        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
});

gulp.task('server_start',function(){
    connect.server({
        name: 'Dev App',
        root: ['dist'],
        port: 9990,
        livereload: true
    });
});
gulp.task('watch_js',function(cb){
    sequence('clean_js','js','html_reload')(cb);
});
gulp.task('watch_css',function(cb){
    sequence('clean_css','css','html_reload')(cb);
});
gulp.task('watch_dev',function(){
    gulp.watch(['src/*.html'], ['html_reload']);
    gulp.watch(['src/**/*.js'], ['watch_js']);
    gulp.watch(['src/**/*.less'], ['watch_css']);
});

gulp.task('serve',['server_start','watch_dev']);

