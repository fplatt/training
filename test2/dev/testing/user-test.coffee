st = require( '../modules/storage' )
st.open()

console.log( '---------testing User----------' )


auth = require( "../modules/auth" )


user = new auth.createUser( '_heinz_' , ->

    user.setFirstname( 'flo' )
    user.setLastname( 'plattner' )
    user.setMail( 'me@myself.org' )
    user.setPassword( 'einMannim Lokal 1234#+ß=?`´-_' )


    if( user.getFirstname() == 'flo' )
        console.log( 'Firstname: success' )
    else
        console.log( 'Firstname: fail' )


    if( user.getLastname() == 'plattner' )
        console.log( 'Lastname: success' )
    else
        console.log( 'Lastname: fail' )


    if( user.getMail() == 'me@myself.org' )
        console.log( 'Mail: success' )
    else
        console.log( 'Mail: fail' )


    if( user.getLoginname() == '_heinz_' )
        console.log( 'Loginname: success' )
    else
        console.log( 'Loginname: fail' )


    if( user.checkPassword( 'einMannim Lokal 1234#+ß=?`´-_' ) )
        console.log( 'Password: success' )
    else
        console.log( 'Password: fail' )


    user.save( ->
        user2 = auth.createUser( '_heinz_' , ->
            testPass = true
            for prop of user
                if not user2[prop]? or not user[prop] is user2[prop]
                    console.log( 'failed at user[' + prop + ']' )
                    testPass = false
                    break
            
            if testPass
                console.log( 'save/load: success' )
            else
                console.log( 'save/load: fail' )
                
            st.close()
        )
    )
)