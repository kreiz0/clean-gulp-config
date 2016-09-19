var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith = require('gulp.spritesmith'),
    minifyCss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    include = require("gulp-include"),
    tinypng = require('gulp-tinypng-compress'),
    uglify = require('gulp-uglify'),
    ignore = require('gulp-ignore'),
    browserSync = require('browser-sync').create();

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/img/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprites.scss',
        imgPath: './img/sprite.png',
        algorithm: 'binary-tree',
        padding: 5
    }));
    var imgStream = spriteData.img
        .pipe(gulp.dest('src/img'));

    var cssStream = spriteData.css
        .pipe(gulp.dest('src/scss'));
});

gulp.task('sass', function () {
    gulp.src('src/scss/*.scss')
        .pipe(
            sass({
                includePaths: require('node-bourbon').includePaths
            })
                .on('error', sass.logError)
        )
        .pipe(autoprefixer({
            browsers: '> 3%'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
    gulp.src('src/*.html')
        .pipe(include())
        .on('error', console.log)
        .pipe(gulp.dest('dist'));
});

gulp.task("js", function () {
    gulp.src("src/js/*.js")
        .pipe(include())
        .on('error', console.log)
        .pipe(gulp.dest("dist"));
});
gulp.task("img", function () {
    gulp.src(['src/img/*.*'])
        .pipe(gulp.dest('dist/img'));
});

gulp.task("fonts", function () {
    gulp.src(['src/fonts/*.*'])
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('serve', ['sass', 'html', 'js', 'img', 'fonts'], function () {

    browserSync.init({
        server: {
            baseDir: './dist',
            directory: true
        },
        notify: false,
        tunnel: false,
        host: 'localhost',
        port: 8888,
        logPrefix: "Front-end"
    });
    gulp.watch(["./src/scss/*.scss"], ['sprite', 'sass']);
    gulp.watch(["./dist/*.css"]).on('change', browserSync.reload);
    gulp.watch(["./src/js/*.js"], ['js']);
    gulp.watch(["./dist/*.js"]).on('change', browserSync.reload);
    gulp.watch(["./src/**/*.html"], ['html']);
    gulp.watch(["./dist/*.html"]).on('change', browserSync.reload);
    gulp.watch(['src/img/*.*'], ['img']);
    gulp.watch(["./dist/img/*.*"]).on('change', browserSync.reload);
});


gulp.task('default', ['serve']);

gulp.task('build:files', function () {
    //css
    gulp.src('dist/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'));
    //js
    gulp.src('src/js/*.js')
        .pipe(include())
        .on('error', console.log)
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
    //img
    gulp.src(['src/img/*.gif', 'src/img/*.png', 'src/img/*.jpg'])
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['build:files'], function () {
    console.log('builded');
});
