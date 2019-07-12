const { src, dest, watch, parallel, series } = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    notify = require( 'gulp-notify' );


function browser_sync() {
	return browserSync.init({
		server: {
			baseDir: './dist/'
		}
    });
}

function reload(done) {
	browserSync.reload();
	done();
}

function css() {

    return src('src/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe( sass({
            errLogToConsole: true,
            outputSyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename({ suffix: '.min'}))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions', '> 5%', 'Firefox ESR'],
            cascade: false,
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
} 

function js() {
    return src(['src/js/jquery.js','src/js/script.js'])        
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify().on('error', console.error))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('dist/js'))
        .pipe( browserSync.stream() );
}

function copy() {
    return src('src/img')
        .pipe(dest('dist'));
};

function cleanimg() {
    return src('dist/img')
        .pipe(clean());
};

function imgmin() {
    return src('src/img/**/*') 
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(dest('dist/img'))
        .pipe( browserSync.stream() );
};

    
exports.js = js;
exports.css = css;
exports.cleanimg = cleanimg;
exports.imgmin = imgmin;
const build = series(cleanimg, copy, imgmin);
exports.default = parallel(css, js, imgmin);
exports.build = build;
