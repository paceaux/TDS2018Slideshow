const Filter = require('gulp-filter');

const assets = 'assets';
const cssPath = `${assets}/css`;
const globalStyles = `${assets}/styleGlobals`

const slidesPath = 'slides';
const slidesFiles = `${slidesPath}/*.html`;

const templatesPath = `${assets}/templates`;
const sources = {
    slides: `slides/*.html`,
    styles: `${cssPath}/*.styl`,
    globalStyles: `${assets}/styleImports/*.styl`
};

const serverUrl = 'tds2015.localhost';


module.exports = {
    browserSync: {
        init: {
            ui: {
                port: 9999,
            },
            server: {
                baseDir: './',
            },
            files: [
                {
                    match: [`${cssPath}/*.css`, `${assets}/js/*.js`, `slides/*.html`]
                }
            ]
        }
    },
    globalStyles: {
        src: `${globalStyles}/*.styl`,
        import: 'imports.styl',
        dest: `${globalStyles}/`
    },
    styles: {
        stylus: {
            paths: [`${assets}/styleImports`],
            import: ['mixins.styl', 'vars.styl'],
            compress: false,
        },
        src: `${cssPath}/**/*.styl`,
        dest: `${cssPath}/`,
        fileName: 'master.css'
    },
    slides: {
        src: slidesFiles,
        wrap: {
            src: `${templatesPath}/slide.html`
        },
        fileName: 'presentation.html',
        slidesTemplate: '<section class="slides"> <%=contents %> </section>',
        slidesShell: `${templatesPath}/shell.html`,
        dest: './'
    },
    serve: ['slides', 'styles', 'browserSync'],
}