var crypto = require( 'crypto' );
var fs = require( 'fs' );
var storage = require( './storage' );


function createPasswordHash( password , salt ) {
	var hashString = salt + password + salt;
	var hash = crypto.createHash( 'sha256' );
	hash.update( hashString );
	
	return hash.digest( 'hex' );
};


function createRandomString( len ) {
	var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var ret = '';
	var i;
	
	for( i = 0 ; i < len ; i += 1 ) {
		ret += chars[ Math.floor( Math.random() * chars.length ) ];
	}
	
	return ret;
}




function User( loginname , cb ) {
	var self;
	
	if( loginname && loginname instanceof String ) {
		this.loginname = loginname;
		
		self = this;
		
		storage.loadObject( 'User' , { loginname : loginname } , function( err , data ) {
			var prop;
			
			if( data ) {
				for( prop in data ) {
					self[prop] = data[prop];
				}
			}
			if( cb && cb instanceof Function ) {
				cb();
			}
		});
	}
	else {
		this.capability = new Capability();
	}

	this.setFirstname = function( name ) {
		this.firstname = name;
	};
		
	this.getFirstname = function() {
		if( this.firstname ) {
			return this.firstname;
		}
		return undefined;
	};
		
	this.setLastname = function( lastname ) {
		this.lastname = lastname;
	};
		
	this.getLastname = function() {
		if( this.lastname ) {
			return this.lastname;
		}
		return undefined;
	};
		
		
	this.setMail = function( mail ) {
		this.mail = mail;
	};
		
	this.getMail = function() {
		if( this.mail ) {
			return this.mail;
		}
		return undefined;
	};
		
	this.setLoginname = function( loginname ) {
		this.loginname = loginname;
	};
		
	this.getLoginname = function() {
		if( this.loginname ) {
			return this.loginname;
		}
		return undefined;
	};
		
	this.checkPassword = function( password ) {
		return this.password && this.salt && this.password == createPasswordHash( password , this.salt );
	};
		
	this.setPassword = function( password ) {
		this.salt = createRandomString( 40 );
		this.password = createPasswordHash( password , this.salt );
	};
		
		
	this.addCapability = function( cap ) {
		this.capability.addCapability( cap );
	};
		
	this.getCapability =  function() {
		if( this.capability ) {
			return this.capability;
		}
		return undefined;
	};
		
		
	this.can = function( cap ) {
		var result = false;
		if( this.capability && this.capability.existCapability( cap ) ) {
			result = true;
		}
		return result;
	};
		
	this.save = function( cb ) {
		var data = {
			firstname: this.getFirstname(),
			lastname: this.getLastname(),
			loginname: this.getLoginname(),
			mail: this.getMail(),
			password: this.password,
			salt: this.salt,
			capability: this.capability
		};
		
		if( cb && cb instanceof Function ) {
			storage.saveObject( 'User' , 'loginname' , data , cb );
		}
		else {
			storage.saveObject( 'User' , 'loginname' , data );
		}
	};
}

// Capability is a simple list of strings which describe what a user can do
function Capability() {
	this.caps = {};
	
	this.setName = function( name ) {
		this.name = name;
	};
		
	this.getName = function() {
		if( this.name ) {
			return this.name;
		}
	};
	
	
	this.addCapability = function( name ) {
		if( !this.existCapability( name ) ) {
			this.caps.push( name );
		}
	};

	this.existCapability = function( name ) {
		var index = this.caps.indexOf( name );
		return index > -1;
	};
		
	this.removeCapability = function( name ) {
		var index = this.caps.indexOf( name );
		if( index > -1 ) {
			this.caps.splice( index , 1 );
		}
	};
}



exports.createUser = function( loginname , cb ) {
	if( cb && loginname ) {
		return new User( loginname , cb );
	}
	else if( loginname ) {
		return new User( loginname );
	}
	else {
		return new User();
	}
};


exports.createCapability = function() {
	var cap = new Capability();
	var i;
	
	if( arguments.length > 0 ) {
		cap.setName( arguments[0] );
	}
	if( arguments.length > 1 ) {
		for( i = 0 ; i < arguments.length ; i += 1 ) {
			cap.addCapability( arguments[i] );
		}
	}
};


exports.getCapabilityFrom = function( loginname , cb ) {
	var user = exports.createUser( loginname , function() {
		if( cb && cb instanceof Function ) {
			cb( user.getCapability() );
		}
	});
};
	