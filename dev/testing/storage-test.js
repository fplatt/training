storage = require( '../modules/storage' );

console.log( '---------testing storage----------' );

data = {
	firstname: 'flo',
	lastname: 'platt'
};


storage.storeObject( 'testUser' , data , function() {
	storage.loadObject( 'Testuser' , { firstname: 'flo' , lastname: 'platt' } , function(err , obj) {
		if( obj.firstname === data.firstname && obj.lastname === data.lastname ) {
			console.log( 'storeObject / loadObject: success' );
		}
		else {
			console.log( 'storeObject / loadObject: fail' );
		}
	});
});