yt = require( '../modules/youtube' );
st = require( '../modules/storage' );

st.open();
yt.loadCredentials( function( ytc ) {
	yt.getAccessToken( ytc , function() {
		st.close();
	});
});