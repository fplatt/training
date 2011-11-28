var mongo = require( "mongodb" );


var srv = new mongo.Server( '192.168.1.4' , 27017 , {} );
var db = new mongo.Db( 'trainingdb' , srv , {} );

// whether the db is ready to receive queries
// if not, the query gets stored in storageReqs for later execution
var dbReady = false;
// whether a request to close the db is received
// in this case all new queries throw an Error
var dbCloseRequested = false;
var storageReqs = [];



exports.open = function() {
	var i;
	var func;
	
	db.open( function() {
		for( i = 0 ; i < storageReqs ; i += 1 ) {
			func = storageReqs[i];
			if( func instanceof Function ) {
				func();
			}
		}
		dbReady = true;
	});
};



exports.saveObject = function( classname , keyAttribute , data , cb ) {
	if( dbCloseRequested === true ) {
		throw new Error( 'Database close was issued before. No new Queries are accepted.' );
	}
	
	var update = function() {
		db.collection( classname.toLowerCase() + 's' , function( err , collection ) {
			var attr = {};
			attr[ keyAttribute ] = data[ keyAttribute ];
			
			if( cb ) {
				collection.update( attr , { $set : data } , { save : true , upsert : true } , cb );
			}
			else {
				collection.update( attr , { $set : data } , { upsert : true } );
			}
		});
	};
	
	if( dbReady ) {
		update();
	}
	else {
		storageReqs.push( update );
	}
};


exports.loadObject = function( classname , filter , cb ) {
	if( dbCloseRequested === true ) {
		throw new Error( 'Database close was issued before. No new Queries are accepted.' );
	}
	if( !cb ) {
		throw new Error( 'no Callback given for loadObject' );
	}
		
	var load = function() {
		db.collection( classname.toLowerCase() + 's' , function( err , collection ) {
			var cursor = collection.find( filter ).limit(1);
			cursor.nextObject( function( err , obj ) {
				if( cb && cb instanceof Function ) {
					cb( err , obj );
				}
			});
		});
	};
		
	if( dbReady ) {
		load();
	}
	else {
		storageReqs.push( load );
	}
};


exports.close = function() {
	dbCloseRequested = true;
	
	var closeDb = function() {
		db.close();
	};
	
	if( dbReady && storageReqs.length === 0 ) {
		closeDb();
	}
	else {
		storageReqs.push( closeDb );
	}
};