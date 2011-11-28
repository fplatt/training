var fs = require( 'fs' );
var http = require( 'https' );
var storage = require( './storage' );
var qs = require( 'querystring' );



function YoutubeCredentials() {
}

YoutubeCredentials.prototype.save = function( cb ) {
	var data = {
		name: 'YoutubeCredentials',
		devKey: this.devKey,
		boundaryString: this.boundaryString,
		authToken: this.authToken,
		clientId: this.clientId,
		clientSecret: this.clientSecret,
		redirUri: this.redirUri,
		refreshToken: this.refreshToken,
		accessToken: this.accessToken
	};
		
	storage.saveObject( 'Util' , 'name' , data );
};
	
YoutubeCredentials.prototype.load = function( cb ) {
	var self = this;
	
	storage.loadObject( 'Util' , { name : 'YoutubeCredentials' } , function( err , data ) {
		var resave = false;
		var prop;
		
		if( data ) {
			for( prop in data ) {
				self[prop] = data[prop];
			}
			if( cb && cb instanceof Function ) {
				cb();
			}
		}
		else if( cb && cb instanceof Function ) {
			cb();
		}
	});
};


exports.loadCredentials = function( cb ) {
	var ytc = new YoutubeCredentials();
	ytc.load( function() {
		if( cb && cb instanceof Function ) {
			cb( ytc );
		}
	});
};



exports.login = function( ytc , cb ) {
	var query = {
		'response_type' : 'code',
		'client_id' : ytc.clientId,
		'redirect_uri' : ytc.redirUri,
		'scope' : 'http%3A%2F%2Fgdata.youtube.com',
		'state' : 'abc'
	};
		
	var queryStr = qs.stringify( query );
	
	var requestOptions = {
		host: 'accounts.google.com',
		port: 443,
		path: '/o/oauth2/auth?' + queryStr,
		method: 'GET'
	};
};
	
	

exports.getAccessToken = function( ytc , cb ) {
	var requestBody = {
		'code' : ytc.authToken,
		'client_id' : ytc.clientId,
		'client_secret' : ytc.clientSecret,
		'redirect_uri' : ytc.redirUri,
		'grant_type' : 'authorization_code'
	};	
	
	var requestBodyStr = qs.stringify( requestBody );
	
	var requestHeaders = {
		'Content-Type' : 'application/x-www-form-urlencoded',
		'content-length' : requestBodyStr.length
	};
	
	var requestOptions = {
		host : 'accounts.google.com',
		port : 443,
		path : '/o/oauth2/token',
		method : 'POST',
		headers : requestHeaders
	};
		
	var req = http.request( requestOptions , function( response ) {
		var responseData = '';
		response.setEncoding( 'utf-8' );
		response.on( 'data' , function( chunk ) { 
			responseData += chunk;
		});
		response.on( 'end' , function() {
			var data;
			
			if( response.statusCode == 200 && response.headers['content-type'].startsWith( 'application/json' ) ) {
				try {
					data = JSON.parse( responseData );
					ytc.accessToken = data.access_token;
					ytc.refreshToken = data.refresh_token;
					ytc.save();
				}
				catch( err ) {
					if( cb && cb instanceof Function ) {
						cb( err , null );
					}
				}
			}
			else {
				if( cb && cb instanceof Function ) {
					cb();
				}
			}
		});
		response.on( 'close' , function( err ) {
			if( cb && cb instanceof Function ) {
				cb( err , null );
			}
		});
	});
	
	req.write( requestBodyStr );
	req.end();
};


exports.refreshAccess = function( ytc , cb ) {
};




exports.upload = function( video ) {
	var boundaryString = '----- BOUNDARY ------';
	
	var doUpload = function() {
		var requestBodyStart = 	'--' + boundaryString + '\n'
					+	'Content-Type: application/atom+xml; charset=UTF-8\n'
					+	'\n'
					+	'<?xml version="1.0"?>'
					+	'<entry xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:yt="http://gdata.youtube.com/schemas/2007">'
					+	'<media:group>'
					+	'<media:title type="plain">' + video.getTitle() + '</media:title>'
					+	'<media:description type="plain">' + video.getDescription() + '</media:description>'
					+	'<media:category scheme="http://gdata.youtube.com/schemas/2007/categories.cat">Education</media:category>'
					+	'<media:keywords>' + video.getTags().join( ', ' ) + '</media:keywords>'
					+	'</media:group>'
					+	'</entry>\n'
					+	'\n'
					+	'--' + boundaryString + '\n'
					+	'Content-Type: ' + video.getContentType() + '\n'
					+	'Content-Transfer-Encoding: binary\n'
					+	'\n';
					
		requestBodyEnd = '\n--' + boundaryString + '--';
		
		fs.stat( video.getFilename() , function( err , stats ) {
			requestOptions = {
				hostname: 'uploads.gdata.youtube.com',
				port: 80,
				path: '/feeds/api/users/default/uploads',
				method: 'POST',
				headers: {
					'Authorization': 'AuthSub token="' + authToken + '"',
					'GData-Version': '2',
					'X-GData-Key': 'key=' + devKey,
					'Slug': video.getLocation(),
					'Content-Type': 'multipart/related; boundary="' + boundaryString + '"',
					'Content-Length': requestBodyStart.length + requestBodyEnd.length + stats.size,
					'Connection': 'close' 
				}
			};
		}); // fs.stat end
	};	
		
	if( credentialsLoaded ) {
		doUpload();
	}
	else {
		bufferedQueries.push( doUpload );
	}
};