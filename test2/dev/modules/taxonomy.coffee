class Tag
    constructor: ( tagId , cb ) ->
        if tagId?
            @_id = tagId
            self = this
            
            storage.loadObject( 'User' , { _id : tagId } , ( err , data ) ->
                if data
                    self[prop] = data[prop] for prop of data
                if cb?
                    cb()
            )
            
            
     setName: ( name ) ->
        @name = name
        
     getName: ->
        return @name if @name?