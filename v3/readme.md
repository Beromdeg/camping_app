#v3: Second version for camping sites application

#Using Semantic-UI

#Show Page 
    * 7 RESTFUL ROUTES //order of ROUTES is important
    
    name      url                  verb    description
    =========================================================================
    INDEX     /campsites           GET     Display a list of all camping sites
    NEW       /campsites/new       GET     Display form to make new campsite
    CREATE    /campsites           POST    Add a new campsite to the DB
    SHOW      /campsites/:id       GET     Shows info about one campsite
