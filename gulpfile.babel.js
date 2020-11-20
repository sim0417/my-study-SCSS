import gulp from "gulp";
import del from "del";
import htmlmin from "gulp-htmlmin";
import gulpImage from "gulp-image";
import sass from "gulp-sass";
import minify from "gulp-csso";
import autoprefixer from "gulp-autoprefixer";
import ws from "gulp-webserver";
import ghPages from "gulp-gh-pages";

sass.compiler = require("node-sass");

const routes = {
  index: {},
  html: {
    watch: "src/**/*.html",
    src: "src/**/*.html",
    dest: "build",
  },
  css: {
    watch: "src/css/**/*.scss",
    src: "src/css/**/*.scss",
    dest: "build/css",
  },
  image: {
    watch: "src/images/**/*",
    src: "src/images/**/*",
    dest: "build/images",
  },
  res: {
    watch: "src/res/**/*",
    src: "src/res/**/*",
    dest: "build/res",
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

const img = () => gulp.src(routes.image.src).pipe(gulpImage()).pipe(gulp.dest(routes.image.dest));

const copyResourceFile = () => gulp.src(routes.res.src).pipe(gulp.dest(routes.res.dest));

const webserver = () =>
  gulp.src("build").pipe(
    ws({
      livereload: true,
      open: true,
    }),
  );

const watch = () => {
  gulp.watch(routes.css.watch, styles);
  gulp.watch(routes.html.watch, html);
  gulp.watch(routes.res.watch, copyResourceFile);
};

const clean = () => del(["build", ".publish"]);

const ghDeploy = () => gulp.src("build/**/*").pipe(ghPages());

const prepare = gulp.series([clean]);

const assets = gulp.series([img, html, styles, copyResourceFile]);

const live = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, live]);

export const build = gulp.series([clean, prepare, assets]);

export const deploy = gulp.series([build, ghDeploy, clean]);

export const clear = gulp.series([clean]);
