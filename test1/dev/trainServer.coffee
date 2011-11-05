http = require( 'http' )

router = require( './app/modules/router' )

srv = http.createServer( router.route )

srv.listen( 2000 )