module.exports = function(grunt) {
	// 项目配置
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		clean : [ '<%=app.dest%>/*', '.tmp/*' ],
		app : {
			src : "app",
			dest : "cigem"
		},
		useminPrepare : {
			html : '<%=app.src%>/*.html',
			options : {
				dest : '<%=app.dest%>'
			}
		},
		usemin : {
			html : "<%=app.dest%>/*.html",
			css : "<%=app.dest%>/asset/css/*.css",
			options : {
				assetsDirs : [ '<%=app.dest%>', '<%=app.dest%>/asset/images']
			}
		},
		copy : {
			dist : {
				files : [{
					expand : true,
					cwd : "<%=app.src%>",
					src : ["*.html",
					       "*.ico",
					       "fonts/*",
					       "asset/images/*.{jpg,jpeg,png,gif}",
					       "bower_components/**/*"],
					dest : "<%=app.dest%>"
				}]
			}
		},
		connect : {
			dev : {
				options : {
					port : 9000,
					base : "<%=app.src%>",
					hostname : 'localhost',
					open : true,
					middleware : function(connect , options) {
						return [
						        require('connect-livereload')({port : 35737}),
						        connect.static(options.base), 
						        connect.directory(options.base)
						];
					}
				}
			},
			dist : {
				options : {
					port : 9000,
					base : "<%=app.dest%>",
					directory : "<%=app.dest%>",
					keepalive : true,
					open : true
				}
			}
		},
		htmlmin : {
			dist : {
				options : {
					collapseWhitespace:true,
					removeComments : true
				},
				files : [
				   {
					   expand : true,
					   cwd : "<%=app.dest%>",
					   src : "*.html",
					   dest : "<%=app.dest%>"
				   }
				]
			}
		},
		watch : {
			livereload : {
				options : {
					livereload : 35737
				},
				files : [ '<%=app.src%>/*.html', 
				          '<%=app.src%>/asset/css/*.css', 
				          '<%=app.src%>/asset/js/*.js' ]
			}
		},
		rev : {
			dist : {
				options: {
			      algorithm: 'md5',
			      length: 8
			    },
				files : {src : [
						         '<%=app.dest%>/asset/css/*.css',
						         '<%=app.dest%>/asset/js/*.js',
						         '<%=app.dest%>/asset/images/*.{jpg,jpeg,png,gif}',
						        ]}
			}
		},
		imagemin : {
			dist : {
				files : [{
					expand : true,
					cwd : '<%=app.dest%>/asset/images/',
					src : '*.{jpg,jpeg,png,gif}'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-rev');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('dev' , ['connect:dev','watch:livereload']);
	
	grunt.registerTask('build', [ 
	                            'clean', 
	                            'useminPrepare', 
	                            'concat',
                            	'cssmin', 
                            	'uglify', 
                            	'copy', 
                            	'imagemin',
                            	'rev',
                            	'usemin',
                            	'htmlmin'
                       ]);
	

};