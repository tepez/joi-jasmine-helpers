import * as TypescriptBuildGulpTasks from '@tepez/typescript-build-gulp-tasks'
import * as Gulp from 'gulp'


TypescriptBuildGulpTasks.getConfig().build.srcFiles.push(
    // These files are executed executeSpecFile so they should not in the build files not the spec files
    '!src/failSpecs/**'
);

TypescriptBuildGulpTasks.register(Gulp);

Gulp.task('default', TypescriptBuildGulpTasks.tasks.buildUnitTest);