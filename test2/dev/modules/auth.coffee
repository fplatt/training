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


    checkPassword : ( password ) ->
        return @password && @salt && @password == createPasswordHash( password , @salt )

    setPassword : ( password ) ->
        @salt = createRandomString( 40 )
        @password = createPasswordHash( password , @salt )
        

	addCapability: ( cap ) ->
		@capability.addCapability( cap )
    
	getCapability: ->
        return @capability if @capability?
    
    setCapability: ( caps ) ->
		if caps.setName? and caps.getName? and caps.addCapability and caps.existCapability and caps.removeCapability
        	@capability = capability

	can: ( cap ) ->
		if @capability and @capability.existCapability( cap )
			return true
		return false
        
        
    save : ( cb ) ->
   			data= 
            firstname: getFirstname()
            lastname: getLastname()
            loginname: getLoginname()
            mail: getMail()
            password: @password
            salt: @salt
			capability: @capability
               
        if cb?
            storage.saveObject( 'User' , 'loginname' , data , cb )
        else
            storage.saveObject( 'User' , 'loginname' , data )


# Capability is a simple list of strings which describe what a user can do
class Capability
	constructor: () ->
		@caps = []
	
	setName: ( name ) ->
		@name = name
		
	getName: ->
		return @name if @name?
	
	
	addCapability: ( name ) ->
		if not existCapability( name )
			@caps.push( name )

	existCapability: ( name ) ->
		index = @caps.indexOf( name )
		return index
		
	removeCapability: ( name ) ->
		index = existCapability( name )
		if index > -1
			@caps.splice( index , 1 )



exports.createUser = ( loginname , cb ) ->
    if cb and loginname
        return new User( loginname , cb )
    else if loginname
        return new User( loginname )
    else
        return new User


exports.createCapability: () ->
	cap = new Capability()
	if arguments.length > 0
		cap.setName( arguments[0] )
	if arguments.length > 1
		for i in [ 1..arguments.length ]
			cap.addCapability( arguments[i] )

	
	
exports.getCapabilityFrom: ( loginname , cb ) ->
	user = exports.createUser( loginname , -> 
		if cb?
			cb( user.getCapability() )
	)
	