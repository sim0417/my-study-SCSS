import gulp from "gulp";
import del from "del";
import htmlmin from "gulp-htmlmin";
import gulpImage from "gulp-image";
import sass from "gulp-sass";
import minify from "gulp-csso";
import autoprefixer from "gulp-autoprefixer";
import ws from "gulp-webserver";

sass.compiler = require("node-sass");

const routes = {
  index: {},
  html: {
    watch: "src/**/*.html",
    src: "src/**/*.html",
    dest: "dist",
  },
  css: {
    watch: "src/css/**/*.scss",
    src: "src/css/**/*.scss",
    dest: "dist/css",
  },
  image: {
    src: "src/images/**/*",
    dest: "dist/images",
  },
  res: {
    src: "src/res/**/*",
    dest: "dist/res",
  },
};

const html = () =>
  gulp
    .src(routes.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(routes.html.dest));

const styles = () =>
  gulp
    .src(routes.css.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        flexbox: true,
        grid: "autoplace",
      }),
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.css.dest));

const watch = () => {
  gulp.watch(routes.css.watch, styles);
  gulp.watch(routes.html.watch, html);
};

const img = () => gulp.src(routes.image.src).pipe(gulpImage()).pipe(gulp.dest(routes.image.dest));

const webserver = () =>
  gulp.src("dist").pipe(
    ws({
      livereload: true,
      open: true,
    }),
  );

const clean = () => del(["dist", ".publish"]);

const copyResourceFile = () => gulp.src(routes.res.src).pipe(gulp.dest(routes.res.dest));

const prepare = gulp.series([clean]);

const assets = gulp.series([img, html, styles, copyResourceFile]);

const live = gulp.parallel([webserver, watch]);

export const build = gulp.series([prepare, assets]);

export const dev = gulp.series([prepare, assets, live]);
