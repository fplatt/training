storage = require( '../modules/storage' )

console.log( '---------testing storage----------' )

data=
    firstname: 'flo'
    lastname: 'platt'
    
    
storage.storeObject( 'testUser' , data , ->
    storage.loadObject( 'Testuser' , { firstname: 'flo' , lastname: 'platt' } , (err , obj) ->
        if obj.firstname is data.firstname and obj.lastname is data.lastname
            console.log( 'storeObject / loadObject: success' )
        else
            console.log( 'storeObject / loadObject: fail' )
    )
)