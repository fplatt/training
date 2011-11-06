mongo = require( "mongodb" )


srv = new mongo.Server( 'localhost' , 27017 , {} )
db = new mongo.Db( 'trainingdb' , srv , {} )

dbReady = false
storageReqs = []


db.open( ->
    i() for i in storageReqs
    storageReqs = []
)



exports.storeObject = ( classname , data , cb ) ->
    if dbReady
        db.collection( classname.toLowerCase() + 's' , ( err , collection ) ->
            collection.insert( data , ->
                cb() if cb?
            )
        )
    else
        storageReqs.push( ->
            db.collection( classname.toLowerCase() + 's' , ( err , collection ) ->
                collection.insert( data , ->
                    cb() if cb?
                )
            )
        )
    
    
    
exports.loadObject = ( classname , filter , cb ) ->
    if not cb
        throw new Error( 'no Callback given for loadObject' )
        
        
    if dbReady
        db.collection( classname.toLowerCase() + 's' , ( err , collection ) ->
            cursor = collection.find( filter )
            cursor.nextObject( ( err , obj ) ->
                cb( err , obj )
            )
        )
    else
        storageReqs.push( ->
            db.collection( classname.toLowerCase() + 's' , ( err , collection ) ->
                cursor = collection.find( filter )
                cursor.nextObject( ( err , obj ) ->
                    cb( err , obj )
                )
            )
        )