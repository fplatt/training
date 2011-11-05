fs = require( 'fs' )


getPublicFile = ( file ) ->
    if file == '/'
        filename = './public/index.html'
    else
        filename = './public' + file


    try
        data  = fs.readFileSync( filename , 'utf-8' )
        return data
    catch error
        return ''




getLecture = ( id ) ->
    console.log( 'try to get lecture' )


getPlaylist = ( id ) ->
    console.log( 'try to get playlist' )




exports.route = ( req , res ) ->

    file = getPublicFile( req.url )
    
    if file.length > 0
        res.end( file )
        return
        
    
    
    parts = req.url.split( '/' )
    
    switch req.method
        when 'GET'
            if parts.length > 1
                switch parts[1]
                    when 'lecture'
                        if parts.length > 2
                            getLecture( parts[2] )
                    when 'playlist'
                        if parts.length > 2
                            getPlaylist( parts[2] )
                    when 'module'
                        if parts.length > 2
                            handleModule()
                    else
                        console.log( 'unrecognized command' )
    
        when 'POST'
            console.log( 'post' )