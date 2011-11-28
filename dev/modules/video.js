var storage = require( './storage' );



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
}

Video.prototype.setLocation = function( loc ) {
	this.location = loc;
};
	
Video.prototype.getLocation = function() {
	if( this.location ) {
		return this.location;
	}
};
	
	
Video.prototype.getFilename = function() {
	if( this.filename ) {
		return this.filename;
	}
};
	
Video.prototype.setFilename= function( name ) {
	this.filename = name;
};
	
	
Video.prototype.setAuthor = function( author ) {
	this.author = author;
};
	
Video.prototype.getAuthor = function() {
	if( this.author ) {
		return this.author;
	}
};
	
	
Video.prototype.setInfotext = function( text ) {
	this.infotext = text;
};
	
Video.prototype.getInfotext = function() {
	if( this.infotext ) {
		return this.infotext;
	}
};
	
	
Video.prototype.setDate = function( date ) {
	this.date = date;
};
	
Video.prototype.getDate = function() {
	return this.date;
};
	
	
Video.prototype.addTag = function( tag ) {
	// if tag not exists
	this.tags.push( tag );
};
	
Video.prototype.getTags = function() {
	return this.tags;
};
	
Video.prototype.removeTag = function( name ) {
	var index = this.tags.indexOf( name );
	if( index > -1 ) {
		this.tags.splice( index , 1 );
	}
};
		
		
Video.prototype.setDuration = function( dur ) {
	this.duration = dur;
};
	
Video.prototype.getDuration = function() {
	if( this.duration ) {
		return this.duration;
	}
};
	
	
Video.prototype.setSource = function( src ) {
	this.source = src;
};
	
Video.prototype.getSource = function() {
	if( this.source ) {
		return this.source;
	}
};
	
	
Video.prototype.getTitle = function() {
	if( this.title ) {
		return this.title;
	}
};
	
Video.prototype.setTitle = function( title ) {
	this.title = title;
};
	
	
Video.prototype.save = function( cb ) {
	var data = {
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