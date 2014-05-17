module.exports = function(grunt) {

	// Load all tasks
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	// Paths
	var PathConfig = {
		sassDir: 	'www/assets/sass/',
		cssDir: 	'www/assets/css/',
		jsDir: 		'www/assets/js/',
		imgDir: 	'www/assets/img/',
		distDir: 	'../dist/assets/'
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

		//JShint
		jshint: {
			files: ['<%= config.distDir %>js/pages/**/*.js']
		},

		//clean files
		clean: {
			options: { force: true },
			css: {
				src: ["<%= config.cssDir %>"]
			},
			distall: {
				src: ["../dist","../dist.zip","../screenshots"]
			},
			dist: {
				src: ["../dist"]
			}
		},

		//copy files
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '../www',
						src: [
							'**',

							'!app/**',
							'!vendor/**',
							
							'*.{md,txt,htaccess}',
							
							'!*{Gruntfile.js,package.json,config.rb,bs-config.js,readme.md,CONTRIBUTING.md,artisan,composer.json}',

							'!.sass-cache/**',
							
							'!public/sass/**',
							'!public/css/**',
							
							'!node_modules/**'
						],
						dest: '../dist/'
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
		// csslint: {
		// 	dev: {
		// 		csslintrc: '.csslintrc'
		// 	},
		// 	strict: {
		// 		src: ['<%= config.distDir %>css/pages/**/*.css']
		// 	}
		// },

		//compile scss
		compass: {
			dist: { 
				options: { 
					force: true,
					config: 'config.rb',
					sassDir: '<%= config.sassDir %>',
					cssDir: '<%= config.distDir %>css',
					outputStyle: 'compressed'
				}
			},
			dev: { 
				options: {
					config: 'config.rb',
					sassDir: '<%= config.sassDir %>',
					cssDir: '<%= config.cssDir %>',
					outputStyle: 'nested',
				}
			}
		},

		//exec commands
		exec: {
			// Generate staging files (not optimized, but after preprocessing)
			// In docpad, static is used for production ready build
			// We use it as a pre-production build (staging), but
			// still environment name for docpad is "static"
			//
			// TODO: replace this with docpad wrapper using docpad API
			//
		},

		//FTP deployment
		'ftp-deploy': {
			build: {
				auth: {
					host: 'ftp.andersonaguiar.com', //your ftp host
					port: 21,
					authKey: 'key1' //.ftppass file on the ./
				},
				src: './dist',
				dest: 'grunt', //your remote directory(grunt was my test)
				exclusions: [
					'./**/.*', //all files what begin with dot
					'./**/Thumbs.db',
					'./**/README.md',
					'./**/*.zip',
					// './**/node_modules',
					// './**/dev'
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
					archive: '../dist.zip'
				},
				files: [
					{ 
						/*flatten: true,*/ expand: true, cwd: './', src: ['../dist/**'], dest: '' 
					}, // includes files in path
				]
			},
			dev: {
				options: {
					archive: 'dist/dev.zip'
				},
				files: [
					{ 
						/*flatten: true,*/ expand: true, cwd: './', src: ['./dev/**'], dest: '' 
					}, // includes files in path
				]
			}
		},

		//print screen (for this is necessary install phantomjs: http://phantomjs.org/download.html)
		//if windows, set the path of phantom on Environment Variables
		autoshot: {
			default_options: {
				options: {
					path: '../screenshots',
					filename: 'screenshot',
					type: 'jpg',
					remote: 'http://localhost:8000/admin/usuarios',
					// local: {
					// 	path: './public',
					// 	port: 7788
					// },
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

		//watcher project
		watch: {
			options: {
				debounceDelay: 500
			},
			css: {
				files: ['<%= config.sassDir %>**/*'],
				tasks: ['compass:dev'/*, 'csslint:strict'*/]
			},
			// js: {
			// 	files: [
			// 		'<%= config.dev %>**/js/*.js',
			// 	],
			// 	tasks: ['uglify:dev','jshint']
			// },
			// livereload: {
			// 	options: {
			// 		livereload: true
			// 	},
			// 	files: ['<%= config.dev %>assets/css/*.css', '<%= config.dev %>assets/js/scripts.js', '<%= config.dev %>**.html']
			// }
		} // watch 

	});

	//watch
	grunt.registerTask('w', ['watch']);

	//dev
	grunt.registerTask('dev', ['compass:dev']);

	//clean CSS
	grunt.registerTask('clean-css', ['clean:css']);

	//deploy
	// grunt.registerTask('deploy', ['ftp-deploy:build']);

	//build
	grunt.registerTask('dist', ['clean:distall', 'copy:dist', /*'compress:dist','autoshot', 'compass:dist', */  'compass:dist', 'jshint', 'concat:js', 'concat:css', 'imagemin:dist'/*  'clean:dist'*/ ]);

};
