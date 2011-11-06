express = require( 'express' )
routes = require( './routes' )
fs = require( 'fs' )


options=
    key: fs.readFileSync( '../../../server.key' )
    cert: fs.readFileSync( '../../../server.crt' )
    

app = express.createServer( options )



# Configuration

app.configure( ->
    app.set( 'views', __dirname + '/views' )
    app.set( 'view engine', 'jade' )
    app.use( express.bodyParser() )
    app.use( express.methodOverride() )
    app.use( express.cookieParser() )
    app.use( express.session( { secret : 'your secret here' } ) )
    app.use( app.router )
    app.use( express.static( __dirname + '/public' ) )
)


app.configure( 'development' , ->
    app.use( express.errorHandler( { dumpExceptions : true, showStack : true } ) )
)


app.configure('production' , ->
    app.use( express.errorHandler() )
)



# Routes

app.get( '/', routes.index )

app.listen( 443 )
console.log( "Express server listening on port %d in %s mode" , app.address().port , app.settings.env )


require( './testing/user-test' )