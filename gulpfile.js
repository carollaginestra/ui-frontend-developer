const { src, dest, watch, parallel, series } = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    notify = require( 'gulp-notify' );

const jsFiles = ['script.js'];

function browser_sync(done) {
	browserSync.init({
		server: {
			baseDir: './dist/'
		}
    });
    
    done();
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

function js(done) {
    jsFiles.map(function (entry) {
        return browserify({
            entries: ['src/js/' + entry]
        })
        .transform(babelify, {presets: ['env']})
        .bundle()
        .pipe(source(entry))
        .pipe(rename({extname: '.min.js'}))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify().on('error', console.error))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('dist/js'))
        .pipe( browserSync.stream() );

    })

    done();

}

function triggerPlumber( src_file, dest_file ) {
	return src( src_file )
		.pipe( plumber() )
		.pipe( dest( dest_file ) );
}

function img() {
	return triggerPlumber( '/src/img/**/*', './dist/img/' );
};


    
exports.js = js;
exports.css = css;
exports.img = img;
exports.default = parallel(css, js, img);