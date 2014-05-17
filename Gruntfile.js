module.exports = function(grunt) {

	// Load all tasks
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	// Paths
	var PathConfig = {
		sassDir: 	'www/assets/sass/',
		cssDir: 	'www/assets/css/',
		jsDir: 		'www/assets/js/',
		imgDir: 	'www/assets/img/',
		distDir: 	'dist/assets/'
	};

	//Set scripts here for Uglify
	var scripts = [
		'<%= config.jsDir %>**/*.js'
	]; 

	grunt.initConfig({
		//import package manifest - informations
		pkg: grunt.file.readJSON("package.json"),

		//config path
		config: PathConfig, 

		//clean files
		clean: {
			options: { force: true },
			css: {
				src: ["<%= config.cssDir %>"]
			},
			distall: {
				src: ["dist","dist.zip","screenshots"]
			},
			dist: {
				src: ["dist"]
			}
		},

		//copy files
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: 'www',
						src: [
							'**',

							'!assets/sass/**',
							'!assets/css/**',
						],
						dest: 'dist/'
					} // makes all src relative to cwd
				]
			}
		}, 

		//concat definitions
		concat: {
			options: {
				stripBanners: true,
				banner: "<%= meta.banner %>"
			},
			js: {
				src: ['<%= config.distDir %>js/**/*.js'],
				dest: '<%= config.distDir %>js/all.min.js',
			},
			css: {
				src: ['<%= config.distDir %>css/**/*.css'],
				dest: '<%= config.distDir %>css/all.min.css',
			}
		},

		//banner definitions
		meta: {
			banner: "/*\n" +
			" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
			" *  <%= pkg.description %>\n" +
			" *  <%= pkg.url %>\n" +
			" *\n" +
			" *  Made by <%= pkg.author.name %>\n" +
			" */\n"
		},


		//minify images
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [
					{
						expand: true,
						cwd: '<%= config.distDir %>img',
						src: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
						dest: '<%= config.distDir %>img',
					}
				],
			}
		},

		//css lint
		csslint: {
			dev: {
				csslintrc: '.csslintrc'
			},
			strict: {
				src: ['<%= config.cssDir %>main.css']
			}
		},

		//JShint
		jshint: {
			files: ['<%= config.jsDir %>main.js']
		},

		//compile scss
		compass: {
			dist: { 
				options: { 
					force: 			true,
					config: 		'config.rb',
					sassDir: 		'<%= config.sassDir %>',
					cssDir: 		'<%= config.distDir %>css',
					outputStyle: 	'compressed'
				}
			},
			dev: { 
				options: {
					config: 		'config.rb',
					sassDir: 		'<%= config.sassDir %>',
					cssDir: 		'<%= config.cssDir %>',
					outputStyle: 	'nested',
				}
			}
		},

		//exec commands
		exec: {
		    cmd: 'npm install && bower install && grunt w' //example
		},

		//FTP deployment
		'ftp-deploy': {
			build: {
				auth: {
					host: 		'ftp.andersonaguiar.com', //your ftp host
					port: 		21,
					authKey: 	'key1' //.ftppass file on the ./
				},
				src: 'dist',
				dest: 'grunt', //your remote directory(grunt was my test)
				exclusions: [
					'./**/.*', //all files what begin with dot
					'./**/Thumbs.db',
					'./**/README.md',
					'./**/*.zip',
					'./node_modules',
					'./dev'
				]
			}
		},

		// make a zipfile
		compress: {
			all: {
				options: {
					archive: 'dist/all.zip'
				},
				files: [
					{ 
						/*flatten: true,*/ expand: true, cwd: './', src: ['./**'], dest: '' 
					}, // includes files in path
				]
			},
			dist: {
				options: {
					archive: 'dist.zip'
				},
				files: [
					{ 
						/*flatten: true,*/ expand: true, cwd: './', src: ['dist/**'], dest: '' 
					}, // includes files in path
				]
			}
		},

		//print screen (for this is necessary install phantomjs: http://phantomjs.org/download.html)
		//if windows, set the path of phantom on Environment Variables
		autoshot: {
			default_options: {
				options: {
					path: 'screenshots',
					filename: 'exemplo-TDC2014',
					type: 'jpg',
					remote: 'http://localhost:8888/TDC-2014/www',
					viewport: [
						'1920x1080',
						'1280x1024',
						'1024x768',
						'768x960',
						'480x600',
						'320x500'
					]
				},
			},
		},

		//Keep multiple browsers & devices in sync when building websites.
		browserSync: {
		    dev: {
		        bsFiles: {
		            src : ['www/index.html','www/assets/css/**/*.css']
		        },
		        options: {
		            server: {
		                baseDir: "www"
		            }
		        }
		    }
		},

		//watcher project
		watch: {
			options: {
				debounceDelay: 500
			},
			css: {
				files: ['<%= config.sassDir %>**/*'],
				tasks: ['compass:dev', 'csslint:strict']
			},
			js: {
				files: [
					'<%= config.jsDir %>**/*.js',
				],
				tasks: ['jshint']
			}
		} // watch 

	});

	//dev
		//watch
		grunt.registerTask('w', ['watch']);

		//browser sync
		grunt.registerTask('bs', ['browserSync']);

		//exec
		grunt.registerTask('letsgo', ['exec']);

		//dev
		grunt.registerTask('dev', ['compass:dev']);


	//finally	
		//build
		grunt.registerTask('dist', ['clean:distall', 'copy:dist', /*'compress:dist','autoshot', 'compass:dist', */  'compass:dist', 'jshint', 'concat:js', 'concat:css', 'imagemin:dist'/*  'clean:dist'*/ ]);
		
		//deploy
		grunt.registerTask('deploy', ['ftp-deploy:build']);

		//compress
		grunt.registerTask('zip', ['compress:dist','compress:all']);    



	//autoshot - print screen
	
	/* 
		OBS:

		Para rodar o browser-sync é necessário instalá-lo globalmente: npm install -g browser-sync
	*/

};
