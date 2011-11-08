crypto = require( 'crypto' )
fs = require( 'fs' )
storage = require( './storage' )


createPasswordHash = ( password , salt ) ->
    hashString = salt + password + salt
    hash = crypto.createHash( 'sha256' )
    hash.update( hashString )
    return hash.digest( 'hex' )


createRandomString = ( len ) ->
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    ret = ''
    
    for i in [0..len]
        ret += chars[Math.floor(Math.random()*chars.length)]
        
    return ret




class User
    constructor: ( loginname , cb ) ->
        if loginname
            @loginname = loginname
            self = this
            
            storage.loadObject( 'User' , { loginname : loginname } , ( err , data ) ->
                if data
                    self[prop] = data[prop] for prop of data
                if cb?
                    cb()
            )


    setFirstname : (name) ->
        @firstname = name

    getFirstname : ->
        return @firstname if @firstname?


    setLastname : (lastname) ->
        @lastname = lastname

    getLastname : ->
        @lastname if this.lastname?


    setMail : (mail) ->
        @mail = mail

    getMail : ->
        return @mail if @mail?


    setLoginname : (loginname) ->
        @loginname = loginname

    getLoginname : ->
        return @loginname if @loginname?


    checkPassword : (password) ->
        return @password && @salt && @password == createPasswordHash( password , @salt )

    setPassword : ( password ) ->
        @salt = createRandomString( 40 )
        @password = createPasswordHash( password , @salt )
        
        
    save : ( cb ) ->
        data= 
            firstname: this.firstname
            lastname: this.lastname
            loginname: this.loginname
            mail: this.mail
            password: this.password
            salt: this.salt
               
        if cb?
            storage.saveObject( 'User' , data , cb )
        else
            storage.saveObject( 'User' , data )



exports.createUser = ( loginname , cb ) ->
    if cb and loginname
        return new User( loginname , cb )
    else if loginname
        return new User( loginname )
    else
        return new User