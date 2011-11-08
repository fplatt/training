mongo = require( "mongodb" )


srv = new mongo.Server( '192.168.1.4' , 27017 , {} )
db = new mongo.Db( 'trainingdb' , srv , {} )

# whether the db is ready to receive queries
# if not, the query gets stored in storageReqs for later execution
dbReady = false 
# whether a request to close the db is received
# in this case all new queries throw an Error
dbcloseRequested = false
storageReqs = []



exports.open = ->
    db.open( ->
        i() for i in storageReqs
        dbReady = true
    )
    
    

exports.saveObject = ( classname , data , cb ) ->
    if dbcloseRequested is true
        throw new Error( 'Database close was issued before. No Queries are accepted.' )
    
    update = ->
        db.collection( classname.toLowerCase() + 's' , ( err , collection ) ->
            if cb
                collection.update( { loginname : data.loginname } , { $set : data } , { save : true , upsert : true } , cb )
            else
                collection.update( { loginname : data.loginname } , { $set : data } , { upsert : true } )
        )
    
    if dbReady
        update()
    else
        storageReqs.push( update )
    
    
    
exports.loadObject = ( classname , filter , cb ) ->
    if dbcloseRequested is true
        throw new Error( 'Database close was issued before. No Queries are accepted.' )
    if not cb
        throw new Error( 'no Callback given for loadObject' )
        
    load = ->
        db.collection( classname.toLowerCase() + 's' , ( err , collection ) ->
            cursor = collection.find( filter ).limit(1)
            cursor.nextObject( ( err , obj ) ->
                cb( err , obj )
            )
        )
        
    if dbReady
        load()
    else
        storageReqs.push( load )
        


exports.close = ->
    dbCloseRequested = true
    
    closeDb = ->
        db.close()
    
    if dbReady and storageReqs.length is 0
        closeDb()
    else
        storageReqs.push( closeDb )