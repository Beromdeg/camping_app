#v5: fith version for camping sites application

#Add mongodb
    * use database to add new campsites instead of hard coding
    * install ODM package for express i.e mongoose

#Setup campsite model 
    * Setup Schema
    
#Add authentication routes
    *show/hide auth links in navbar correctly
    (Eg: signed in as username & logout)

#Add middleware
    
#Show Page 
    * 7 RESTFUL ROUTES //order of ROUTES is important
    
    name      url                  verb    description
    =========================================================================
    INDEX     /campsites           GET     Display a list of all camping sites
    NEW       /campsites/new       GET     Display form to make new campsite
    CREATE    /campsites           POST    Add a new campsite to the DB
    SHOW      /campsites/:id       GET     Shows info about one campsite