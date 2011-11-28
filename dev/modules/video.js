
function Video( videoId , cb ) {
	var self;
	
	if( videoId ) {
		this._id = videoId;
		self = this;
		
		storage.loadObject( 'Video' , { _id : videoId } , function( err , data ) {
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
		this.tags = [];
	}
		
			
	this.setLocation = function( loc ) {
		this.location = loc;
	};
		
	this.getLocation = function() {
		if( this.location ) {
			return this.location;
		}
	};
		
		
	this.getFilename = function() {
		if( this.filename ) {
			return this.filename;
		}
	};
		
	this.setFilename= function( name ) {
		this.filename = name;
	};
		
		
	this.setAuthor = function( author ) {
		this.author = author;
	};
		
	this.getAuthor = function() {
		if( this.author ) {
			return this.author;
		}
	};
		
		
	this.setInfotext = function( text ) {
		this.infotext = text;
	};
		
	this.getInfotext = function() {
		if( this.infotext ) {
			return this.infotext;
		}
	};
		
		
	this.setDate = function( date ) {
		this.date = date;
	};
		
	this.getDate = function() {
		return this.date;
	};
		
		
	this.addTag = function( tag ) {
		// if tag not exists
		this.tags.push( tag );
	};
		
	this.getTags = function() {
		return this.tags;
	};
		
	this.removeTag = function( name ) {
		var index = this.tags.indexOf( name );
		if( index > -1 ) {
			this.tags.splice( index , 1 );
		}
	};
			
			
	this.setDuration = function( dur ) {
		this.duration = dur;
	};
		
	this.getDuration = function() {
		if( this.duration ) {
			return this.duration;
		}
	};
		
		
	this.setSource = function( src ) {
		this.source = src;
	};
		
	this.getSource = function() {
		if( this.source ) {
			return this.source;
		}
	};
		
		
	this.getTitle = function() {
		if( this.title ) {
			return this.title;
		}
	};
		
	this.setTitle = function( title ) {
		this.title = title;
	};
		
		
	this.save = function( cb ) {
		data = {
			_id: this._id,
			location: this.getLocation(),
			title: this.getTitle(),
			author: this.getAuthor(),
			infotext: this.getInfotext(),
			date: this.getDate(),
			tags: this.getTags(),
			duration: this.getDuration(),
			source: this.getSource(),
			filename: this.getFilename()
		};
			
		if( cb ) {
			storage.saveObject( 'Video' , '_id' , data , cb );
		}
		else {
			storage.saveObject( 'Video' , '_id' , data );
		}
	};
}


exports.createVideo = function( videoId , cb ) {
	if( videoId && cb ) {
		return new Video( videoId , cb );
	}
	else if( videoId ) {
		return new Video( videoId );
	}
	else {
		return new Video();
	}
};