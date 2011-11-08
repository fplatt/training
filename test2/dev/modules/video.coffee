
class Video
    
    constructor: ( video_id , cb ) ->
        if videoId
            @_id = videoId
            self = this
            
            storage.loadObject( 'User' , { _id : videoId } , ( err , data ) ->
                if data
                    self[prop] = data[prop] for prop of data
                if cb?
                    cb()
            )
        else
            @tags = []
            
    
    setLocation: ( loc ) ->
        @location = loc
        
    getLocation: ->
        return @location if @location?
        
        
    setAuthor: ( author ) ->
        @author = author
        
    getAuthor: ->
        return @author if @author?
        
        
    setInfotext: ( text ) ->
        @infotext = text
        
    getInfotext: ->
        return @infotext if @infotext?
        
        
    setDate: ( date ) ->
        @date = date
        
    getDate: ->
        return @date if @date?
        
        
    addTag: ( tag ) ->
        # if tag not exists
        @tags.push( tag )
        
    getTags: ->
        return @tags if @tags?
        
    removeTagById: ( tagid ) ->
        index = @tags.indexOf( tagid )
        if index > -1
            @tags.splice( index , 1 )
    
    
    setDuration: ( dur ) ->
        @duration = dur
        
    getDuration: ->
        return @duration if @duration?
        
        
    setSource: ( src ) ->
        @source = src
        
    getSource: ->
        return @source if @source?
        
        
    save: ( cb ) ->
        data = 
            _id: @_id
            location: getLocation()
            author: getAuthor()
            infotext: getInfotext()
            date: getDate()
            tags: getTags()
            duration: getDuration()
            source: getSource()
            
        if cb?    
            storage.saveObject( 'Video' , '_id' , data , cb )
        else
            storage.saveObject( 'Video' , '_id' , data )
            
            
            
exports.createVideo = ( videoId , cb ) ->
    if videoId? and cb?
        return new Video( videoId , cb )
    else if videoId?
        return new Video( videoId )
    else
        return new Video()