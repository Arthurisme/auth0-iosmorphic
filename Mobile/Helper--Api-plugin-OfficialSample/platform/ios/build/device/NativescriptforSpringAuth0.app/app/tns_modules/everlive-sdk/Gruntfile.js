'use strict';

const tfis2 = require('./test/tfis/TFIS2');
const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');
const spawn = childProcess.spawn;
const _ = require('underscore');
const _s = require('underscore.string');
const cheerio = require('cheerio');
const saveLicense = require('uglify-save-license');
const upath = require('upath');
const offsetLines = require('offset-sourcemap-lines');
const transformTools = require('browserify-transform-tools');
const walk = require('walkdir');
const babelify = require('babelify');
const browserifyInc = require('browserify-incremental');

const sdkPackage = require('./package.json');

_.templateSettings = {
    interpolate: /\"<%=([\s\S]+?)%>\"/g
};

_.mixin(_s.exports());

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks('grunt-exorcise');
    grunt.loadNpmTasks('grunt-contrib-compress');

    var everliveCordovaPath = './EverliveCordova';
    var everliveNativeScriptPath = './EverliveNativeScript';

    var testResultsFileNameTemplate = './test/testResults';

    function getTestResutsFileName(platform) {
        return testResultsFileNameTemplate + platform + '.tap';
    }

    var PLATFORMS = {
        All: 'all',
        Desktop: 'desktop',
        Cordova: 'cordova',
        NativeScript: 'nativescript',
        CordovaAndNativeScript: 'cordovaandnativescript',
        Nodejs: 'nodejs'
    };

    var TARGETS = {
        Everlive: 'everlive',
        Sitefinity: 'sitefinity'
    };

    var platform = (grunt.option('platform') || PLATFORMS.All).toLowerCase();

    var suite = grunt.option('suite');

    var DEFAULT_FILE = 'test/suites/everlive-all.html';
    var file = grunt.option('file') || DEFAULT_FILE;

    if (suite) {
        file = 'test/suites/' + suite + '/' + suite + '.html';
    }

    if (!fs.existsSync(file)) {
        grunt.fail.fatal('File - ' + file + ' does not exist');
    }

    var watchFiles = grunt.option('watch-files');
    if (watchFiles) {
        watchFiles = watchFiles.split(' ');
    } else {
        watchFiles = 'test/suites/**/*.js';
    }

    var target = grunt.option('target') || TARGETS.Everlive;
    let isCorrectPlatform = _.chain(TARGETS).keys().contains(key => key.toLowerCase() === target);
    if (!isCorrectPlatform) {
        grunt.fail.fatal('Incorrect target: ' + target);
    }

    var licenseAndVersion = fs.readFileSync('./license', 'utf8');
    licenseAndVersion = '/*\r\n' + licenseAndVersion + '\r\n';
    licenseAndVersion += 'Everlive SDK Version: <%= sdkVersion %>' + '\r\n*/\r\n';

    let browserifyConfig = {
        options: {
            external: ['application-settings', 'local-settings', 'file-system', 'http', 'stream', 'buffer', 'url',
                'https', 'zlib', 'node-localstorage', 'nativescript-push-notifications', 'platform'],
            browserifyOptions: _.extend({
                debug: true,
                standalone: _.capitalize(target) //Everlive, Sitefinity etc
            }, browserifyInc.args),
            transform: [
                [babelify, {
                    presets: ['es2015'],
                    plugins: [
                        'transform-class-properties',
                        ['transform-es2015-classes', {loose: true}]
                        // 'syntax-async-functions',
                        // 'transform-runtime',
                        // ['transform-regenerator', {
                        //     asyncGenerators: false,
                        //     generators: false,
                        //     async: true
                        // }]
                    ],
                    sourceMaps: 'inline'
                }],

                transformTools.makeRequireTransform('requireTransform', null, function () {
                    const wd = path.join(__dirname, 'src');
                    const quotesRegex = new RegExp('\'', 'g');
                    const doubleQuotesRegex = new RegExp('"', 'g');

                    const modulesMap = {};

                    walk.sync(path.join(wd, 'scripts'), {no_recurse:true}).forEach(script => {
                        let scriptStat = fs.statSync(script);
                        if (!scriptStat.isDirectory()) {
                            grunt.fail.fatal('Only directories are allowed in the scripts folder. The scripts must be a valid npm package.')
                        }

                        let parsedScript = path.parse(script);
                        let scriptName = parsedScript.name;

                        modulesMap[scriptName] = path.join('scripts', scriptName);
                        grunt.log.writeln(`Indexed script: ${scriptName}`);
                    });

                    walk.sync(wd)
                        .map(filePath => {
                            let relativeFilePath = path.relative(wd, filePath);
                            let parsedFile = path.parse(relativeFilePath);
                            return _.extend({}, parsedFile, {
                                path: parsedFile.dir.split(path.sep),
                                isCommonModule: parsedFile.dir.split(path.sep)[0] === 'common'
                            });
                        })
                        .filter(parsedFile => {
                            //we need only files, javascript ones
                            return parsedFile.ext === '.js';
                        })
                        .filter(parsedFile => {
                            //we won't need files that are different than the targeted ones to be indexed
                            let fileBaseDir = parsedFile.path[0];
                            return fileBaseDir === target || fileBaseDir === 'common';
                        })
                        .forEach(parsedFile => {
                            //e.g. when we ask for 'require' from the map we will get 'sitefinity/constants',
                            //which later will be resolved to the specific relative path, e.g. '../sitefinity/constants'
                            let modulePath = path.join(parsedFile.dir, parsedFile.name);
                            //we need to skip the root folder when requiring. E.g. we do not want to require('platform/storages/LocalStorage')
                            //instead we want require('storages/LocalStorage'). Same goes if the module is located in common
                            let moduleRequirePathChain = _.chain(parsedFile.path);
                            let moduleRequirePath;
                            if (parsedFile.path.length > 1) {
                                moduleRequirePath = moduleRequirePathChain
                                    .without(parsedFile.path[0])
                                    .value()
                                    .concat([parsedFile.name])
                                    .join(path.sep);
                            } else {
                                moduleRequirePath = parsedFile.name;
                            }

                            if (parsedFile.isCommonModule) {
                                //require common module only by prefixing them with common/
                                moduleRequirePath = path.join('common', moduleRequirePath);
                            }

                            if (!!modulesMap[moduleRequirePath]) {
                                grunt.fail.fatal(`Module ${moduleRequirePath} is already indexed as ${modulesMap.get(moduleRequirePath)}`);
                            }

                            modulesMap[moduleRequirePath] = modulePath;
                        });

                    Object.keys(modulesMap).forEach(key => {
                        const value = modulesMap[key];

                        delete modulesMap[key];
                        modulesMap[upath.toUnix(key)] = upath.toUnix(value);
                    });

                    return (args, opts, cb) => {
                        const requireArgRaw = args[0];
                        if (requireArgRaw === '_dynamic_module_') {
                            return cb(null, `require(${requireArgRaw})`);
                        }

                        let requireArg = requireArgRaw.replace(quotesRegex, '').replace(doubleQuotesRegex, '');
                        if (!modulesMap[requireArg]) {
                            return cb(null, `require('${requireArgRaw}')`);
                        }

                        let modulePath = modulesMap[requireArg];
                        let relativePath = path.relative(path.dirname(opts.file), wd) || '.';
                        let rewrittenPath = upath.normalizeSafe(`${relativePath}/${modulePath}`);

                        const unixPath = upath.toUnix(rewrittenPath);
                        let newRequire = `require('${unixPath}')`;
                        return cb(null, newRequire);
                    }
                }())
            ],
            banner: licenseAndVersion,
            configure: function (b) {
                browserifyInc(b, {cacheFile: './browserify-cache.json'});
            }
        }
    };

    browserifyConfig.files = {};
    browserifyConfig.files[`${target}.js`] = ['./src/index.js'];

    grunt.initConfig({
        sdkVersion: sdkPackage.version,
        sessionId: null,
        env: {
            sessionId: {
                sessionId: function () { //grunt-env with function to set the sessionId env variable
                    return grunt.config.get('sessionId');
                }
            }
        },
        shell: {
            options: {
                failOnError: false
            },
            initializeNativeScriptPlatforms: {
                command: 'tns platform add android',
                options: {
                    execOptions: {
                        cwd: everliveNativeScriptPath
                    }
                }
            },
            initializeCordovaPlatforms: {
                command: 'cordova platform add android',
                options: {
                    execOptions: {
                        cwd: everliveCordovaPath
                    }
                }
            },
            initializeCordovaPlugins: {
                command: 'cordova plugin add https://github.com/apache/cordova-plugin-file.git https://github.com/apache/cordova-plugin-whitelist https://github.com/apache/cordova-plugin-file-transfer.git https://github.com/Telerik-Verified-Plugins/PushNotification',
                options: {
                    execOptions: {
                        cwd: everliveCordovaPath
                    }
                }
            },
            deployCordovaApp: {
                command: 'cordova run android',
                options: {
                    execOptions: {
                        cwd: everliveCordovaPath
                    }
                }
            },
            deployNativeScriptApp: {
                command: 'tns run android --justlaunch',
                options: {
                    execOptions: {
                        cwd: everliveNativeScriptPath
                    }
                }
            },
            clearLogcat: {
                command: 'adb logcat -c'
            }
        },
        watch: {
            test: {
                files: watchFiles,
                tasks: ['test'],
                options: {
                    spawn: false,
                    atBegin: true
                }
            },
            browserify: {
                files: ['./src/**/**/*.js'],
                tasks: ['build'],
                options: {
                    spawn: false,
                    atBegin: true
                }
            }
        },
        connect: {
            tests: {
                options: {
                    base: './',
                    keepalive: true,
                    useAvailablePort: true
                }
            }
        },
        exorcise: {
            everlive: {
                options: {},
                files: function () {
                    let files = {};
                    files[`./${target}.map`] = [`./${target}.js`];
                    return files;
                }()
            }
        },
        browserify: {
            build: browserifyConfig
        },
        uglify: {
            dist: {
                options: {
                    preserveComments: saveLicense
                },
                files: function () {
                    let files = {};
                    files[`./dist/${target}.all.min.js`] = [`./dist/${target}.all.js`];
                    return files;
                }()
            }
        },
        copy: {
            license: {
                src: './license',
                dest: './dist/license'
            },
            readme: {
                src: './readme',
                dest: './dist/readme'
            }
        },
        compress: {
            dist: {
                options: {
                    archive: `${target}SDK.JS.zip`
                },
                cwd: './dist',
                src: ['**'],
                flatten: true,
                expand: true
            }
        }
    });

    function templateProcessFile(inputPath, config, outputPath) {
        outputPath = outputPath || inputPath;

        var fileContent = fs.readFileSync(inputPath, 'utf8');
        var compiledTemplate = _.template(fileContent);
        var processedFile = compiledTemplate(config);

        fs.writeFileSync(outputPath, processedFile);
    }

    grunt.registerTask('replaceVersion', function () {
        templateProcessFile(`./${target}.js`, sdkPackage);
    });

    grunt.registerTask('loginInIdentity', function () {
        var done = this.async();
        tfis2.login(function (err, sessionId) {
            if (err) {
                return done(err);
            }

            console.log('SessionID: ' + sessionId);
            grunt.config.set('sessionId', sessionId);
            done();
        });
    });

    grunt.registerTask('processExternalConfig', function () {
        var externalConfigFolder = path.join('./test', 'suites');
        var externalConfigTemplate = fs.readFileSync(path.join(externalConfigFolder, 'externalconfig.template.js'), 'utf8');
        var compiledTemplate = _.template(externalConfigTemplate);

        var detectPlatformCode = fs.readFileSync(path.join('./test', 'everlive.platform.js'), 'utf8');
        var detectPlatformCompiledFunction = new Function(detectPlatformCode);

        var externalConfig = compiledTemplate({
            sessionId: grunt.config.get('sessionId'),
            detectPlatform: detectPlatformCompiledFunction.toString()
        });

        fs.writeFileSync(path.join(externalConfigFolder, 'externalconfig.js'), externalConfig);
    });

    grunt.registerTask('copyDependencies', function () {
        npmModules.forEach(function (module) {
            if (!module.browserify) {
                grunt.file.copy(module.path, './dist/src/' + module.name + '.js');
            }
        });
    });

    grunt.registerTask('copyEverlive', function () {
        grunt.file.copy(`./${target}.js`, `./dist/${target}.all.js`);
        grunt.file.copy(`./${target}.map`, `./dist/${target}.all.map`);
    });

    grunt.registerTask('copyTests', function (platformName) {
        var testsFolder = path.join(__dirname, 'test');
        platformName = platformName.toLowerCase();

        var platformFolderContent;
        if (platformName === PLATFORMS.Cordova) {
            platformFolderContent = path.join(everliveCordovaPath, 'www');
            fs.removeSync(platformFolderContent);
            fs.mkdirsSync(platformFolderContent);
        } else if (platformName === PLATFORMS.NativeScript) {
            platformFolderContent = path.join(everliveNativeScriptPath, 'app');
        }

        var platformTestsFolder = path.join(platformFolderContent, 'test');

        fs.readdirSync('./test')
            .forEach(function (fileName) {
                var filePath = path.join(testsFolder, fileName);
                fs.copySync(filePath, path.join(platformTestsFolder, fileName));
            });

        fs.copySync(`./${target}.js`, path.join(platformTestsFolder, `${target}.js`));
        fs.copySync(`./${target}.map`, path.join(platformTestsFolder, `${target}.map`));
    });

    function handleOutput(stdout, stderr, filter, logPlatform, done) {
        var mochaEndRegex = /# fail ([0-9]+)/;
        var delimiter = 'Mocha^^';
        var uniqueLines = {};

        stdout.on('data', function (data) {
            var parsedData = data.toString();
            var hasFailed = parsedData.indexOf('not ok') !== -1;
            var lines = !hasFailed ? parsedData.split(/\r\n|\n|\r/g) : [parsedData];
            lines.forEach(function (line) {
                var delimiterIndex = line.indexOf(delimiter);
                var hasDelimiter = delimiterIndex !== -1;
                if ((hasDelimiter && logPlatform === PLATFORMS.Cordova) ||
                    (hasDelimiter && logPlatform === PLATFORMS.NativeScript) ||
                    (hasDelimiter && (logPlatform === PLATFORMS.Desktop || logPlatform === PLATFORMS.Nodejs))) {

                    var startIndex = delimiterIndex + delimiter.length;
                    var endIndex = !hasFailed ? line.lastIndexOf('"') : line.lastIndexOf('\r\n'); //this check is added in order to read successfully error messages
                    if (endIndex === -1) {
                        endIndex = line.length;
                    }

                    var log = line.substring(startIndex, endIndex).trim();
                    if (!uniqueLines[log]) {
                        uniqueLines[log] = true;
                        grunt.log.writeln(log);
                        fs.appendFileSync(getTestResutsFileName(logPlatform), log + '\r\n');

                        if (mochaEndRegex.test(log)) {
                            done();
                        }
                    }
                }
            });
        });

        stderr.on('data', function (data) {
            grunt.log.writeln(data.toString());
        });
    }

    function handleSpawnProcess(procName, args, filter, logPlatform, done) {
        var childProc = spawn(procName, args);

        handleOutput(childProc.stdout, childProc.stderr, filter, logPlatform, done);

        process.on('exit', function () {
            childProc.kill();
        });
    }

    grunt.registerTask('readLogcat', function (logPlatform) {
        logPlatform = logPlatform.toLowerCase();
        var done = this.async();
        var adbFilter;
        if (logPlatform === PLATFORMS.Cordova) {
            adbFilter = /CordovaLog|SystemWebChromeClient/;
        } else if (logPlatform === PLATFORMS.NativeScript) {
            adbFilter = /JS|TNS.Native/;
        }

        handleSpawnProcess('adb', ['logcat'], adbFilter, logPlatform, done);
    });

    grunt.registerTask('testPhantomjs', function () {
        var done = this.async();
        if (path.extname(file) !== '.html') {
            grunt.fail.fatal('The file to run in phantomjs must be of type html ' + file);
        }

        handleSpawnProcess('./node_modules/phantomjs/bin/phantomjs', ['./test/external/phantomjsTest.js', file], null, PLATFORMS.Desktop, done);
    });

    grunt.registerTask('createCordovaFolders', function () {
        fs.ensureDirSync(path.join(everliveCordovaPath, 'platforms'));
        fs.ensureDirSync(path.join(everliveCordovaPath, 'plugins'));
        fs.ensureDirSync(path.join(everliveCordovaPath, 'www'));
    });

    grunt.registerTask('processCordovaConfig', function () {
        var configFilePath = path.join(everliveCordovaPath, 'config.xml');
        var configTemplateFilePath = path.join(everliveCordovaPath, 'config.template.xml');
        var configContent = fs.readFileSync(configTemplateFilePath, 'utf8');
        var compiledTemplate = _.template(configContent);
        var configuredConfig = compiledTemplate({file: '"' + file + '"'});

        fs.writeFileSync(configFilePath, configuredConfig);
    });

    grunt.registerTask('createNativeScriptFolders', function () {
        var platformsPath = path.join(everliveNativeScriptPath, 'platforms');
        fs.removeSync(platformsPath);
        fs.ensureDirSync(platformsPath)
    });

    function getTestsFromInputFile() {
        let entryFileContent = fs.readFileSync(file, 'utf8');
        let $ = cheerio.load(entryFileContent);
        let scripts = $('script');
        return scripts[0].attribs['data-js'].split(',').map(function (test) {
            test = test.trim();

            if (file === DEFAULT_FILE) {
                test = path.join('test', 'suites', test);
            } else {
                var testPath = path.resolve('/', file, '..');
                test = path.join(testPath, test);
            }

            return upath.normalize(test);
        });
    }

    grunt.registerTask('processNativeScriptConfig', function () {
        var tests = getTestsFromInputFile();

        var compiledTemplate = _.template('module.exports = {tests: "<%= nativeScriptTests %>"};');
        var nativeScriptConfig = compiledTemplate({nativeScriptTests: JSON.stringify(tests)});
        fs.outputFileSync(path.join(everliveNativeScriptPath, 'app', 'config.js'), nativeScriptConfig);
    });

    grunt.registerTask('clearTestResults', function (platform) {
        fs.removeSync(getTestResutsFileName(PLATFORMS[platform]));
    });

    grunt.registerTask('test', function () {
        var tasks;

        function getTaskByPlatform(platform) {
            return 'test' + platform;
        }

        if (platform === PLATFORMS.All) {
            tasks = Object.keys(PLATFORMS)
                .filter(function (platform) {
                    return platform !== 'All' && platform !== 'CordovaAndNativeScript';
                })
                .map(function (platform) {
                    return getTaskByPlatform(platform);
                });
        } else if (platform === PLATFORMS.CordovaAndNativeScript) {
            tasks = [getTaskByPlatform('Cordova'), getTaskByPlatform('NativeScript')];
        } else {
            tasks = Object.keys(PLATFORMS)
                .filter(function (platformKey) {
                    return PLATFORMS[platformKey] === platform;
                })
                .map(function (platformKey) {
                    return getTaskByPlatform(platformKey);
                });
        }

        console.log('Running ' + tasks + ' tasks');
        grunt.task.run(tasks);
    });

    grunt.registerTask('clearDistFolder', function () {
        if (grunt.file.exists('dist')) {
            grunt.file.delete('dist');
        } else {
            grunt.log.writeln('No dist folder to clear');
        }
    });

    grunt.registerTask('offsetSourceMap', function () {
        let licenseLineCount = licenseAndVersion.match(/\n/g).length + 1;
        let map = fs.readFileSync(`./${target}.map`, 'utf-8');
        let mapObject = JSON.parse(map);
        let offsetMap = offsetLines(mapObject, licenseLineCount);
        fs.writeFileSync(`./${target}.map`, JSON.stringify(offsetMap), 'utf-8');
    });

    //release build
    grunt.registerTask('default', ['clearDistFolder', 'build', 'copyEverlive', 'uglify:dist', 'copy:license', 'copy:readme', 'compress:dist']);

    grunt.registerTask('build', ['browserify:build', 'exorcise:everlive', 'offsetSourceMap', 'replaceVersion']);
    grunt.registerTask('buildWatch', ['watch:browserify']);

    //common tests task
    grunt.registerTask('testCommon', ['loginInIdentity', 'processExternalConfig', 'build']);

    //desktop
    grunt.registerTask('testDesktop', ['testCommon', 'clearTestResults:Desktop', 'testPhantomjs']);

    //cordova
    grunt.registerTask('initializeCordova', ['createCordovaFolders', 'processCordovaConfig', 'shell:initializeCordovaPlatforms', 'shell:initializeCordovaPlugins']);
    grunt.registerTask('testCordova', ['testCommon', 'clearTestResults:Cordova', 'initializeCordova', 'copyTests:Cordova',
        'shell:deployCordovaApp', 'shell:clearLogcat', 'readLogcat:Cordova']);

    //nativescript
    grunt.registerTask('testNativeScript', ['testCommon', 'clearTestResults:NativeScript', 'createNativeScriptFolders', 'shell:initializeNativeScriptPlatforms',
        'copyTests:NativeScript', 'processNativeScriptConfig', 'shell:deployNativeScriptApp', 'shell:clearLogcat', 'readLogcat:NativeScript']);

    //nodejs
    grunt.registerTask('nodejsRunTests', function () {
        var tests = JSON.stringify(getTestsFromInputFile());

        var done = this.async();
        handleSpawnProcess('node', ['./test/external/nodejsTest.js', tests], null, PLATFORMS.Nodejs, done);
    });

    grunt.registerTask('testNodejs', ['testCommon', 'clearTestResults:Nodejs', 'nodejsRunTests']);
};
