var storage = require( './storage' );


function Tag( tagId , cb ) {
	var self;

	if( tagId ) {
		this._id = tagId;
		self = this;
		
		storage.loadObject( 'User' , { _id : tagId } , function( err , data ) {
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
}

Tag.prototype.setName = function( name ) {
	this.name = name;
};
	
Tag.prototype.getName = function() {
	if( this.name ) {
		return this.name;
	}
};