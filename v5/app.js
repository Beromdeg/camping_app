var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    localStrategy           = require("passport-local"),
    passporLocalMongoose    = require("passport-local-mongoose"),
    User                    = require("./model/user.js")

//==============================
    //connect to ur mongoose and mlab database hosting
    //mongoose.connect('mongodb://<username:password>@ds<  >.mlab.com:57627/<application_name>');
//==============================
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

//============================
//AUTH CONFIG
//============================
app.use(require("express-session")({
    secret              : "this is secret code",
    save                : false,
    saveUninitialized   : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//use local strategy
passport.use(new localStrategy(User.authenticate()));
//middleware to pass currentUser info
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


//SCHEMA SETUP (one schema for now, will break into seperate files later)
var campsiteSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//modeling our schema
var Campsite = mongoose.model('Campsite', campsiteSchema);

//create and save to DB
// Campsite.create( {
//     name:'site1',
//     image:'https://images.unsplash.com/photo-1489914169085-9b54fdd8f2a2?auto=format&fit=crop&w=750&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D',
//     description: 'A great place to camp and fishing'
// }, function(err, campsite){
//     if(err){
//         console.log(err);
//     }else{
//         console.log('NEW ADDED CAMPSITE:');
//         console.log(campsite);
//     }
// });

//landing route
app.get('/', function(req, res){
    res.render('landing');
});

//===========================
//ROUTES
//===========================
//INDEX ROUTE - Display a list of all camping sites
//can call /campsites to /index
app.get('/campsites', function(req,res){
    //console.log(req.user); //getting user data i.e username & ID
    //Get all the campsites from the DB
    Campsite.find({}, function(err, allCampsites){
        if(err){
            console.log(err);
        }else{
            res.render('campsites', {campsite: allCampsites}); // no err then render campsites
        }
    });
   
});

//CREATE ROUTE- Add a new campsite to the DB
//display only landing and home page if not logged in
app.post('/campsites', isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampsite = {name:name, image:image, description:desc};  //our new campsite object to be added to the DB now 
    //Create new campsite and save to the DB, no more hard coding
    Campsite.create(newCampsite, function(err, newCampsite){
        if(err){
            console.log(err);
        }else{
            res.redirect('/campsites');     //back to get request campsites route        
        }
    });
    
});

//NEW ROUTE - Display form to make new campsite
app.get('/campsites/new', isLoggedIn, function(req, res){
    res.render('new');
});

//SHOW ROUTE - adding a new route to show the info of specific campsite
//order of the route is imp so this has to be after the RESTFUL routes
app.get('/campsites/:id', isLoggedIn, function(req, res){
    //find the campsite with the requested ID, finding by ID model.findById(id, callback) is unique than find by name
    Campsite.findById(req.params.id, function(err, foundCampsite){
        if(err){
            console.log(err);
        }else{
            res.render('show', {site: foundCampsite});
        }
    });
    //render the show template with that campsite
    
    //res.send('This is the show page!');
    
});

//===========================
//Authentication
//===========================
app.get('/register', function(req, res) {
    res.render('register');
});
//sign up logic
app.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campsites");
        });
    });
});

//sign in logic
app.get('/login', function(req, res) {
    res.render('login');
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/campsites',
    failureRedirect: '/login'
}), function(req, res) {
    // body...
});

//LOGOUT route
app.get("/logout", function(req, res) {
    req.logout();   //passport destorys the session, no transcation here
    res.redirect("/"); //redirect to home page after logout
});

//middleware for isLoggedIn 
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next(); //run the next function, here is the addcampsites route call_back fns
    }
    res.redirect("/login"); //to the login form
}
app.listen(process.env.PORT, process.env.ID, function(){
    console.log('camping_app started!');
});
