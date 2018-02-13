var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose")

mongoose.connect('mongodb://localhost/camping_app'); //creates camping_app DB inside the mongodb
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

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

//=================================
//ROUTES
//=================================
//restful routes
//INDEX ROUTE - Display a list of all camping sites
//campsites to /index
app.get('/campsites', function(req,res){
    //Get all the campsites from the DB
    Campsite.find({}, function(err, allCampsites){
        if(err){
            console.log(err);
        }else{
            res.render('index', {campsite: allCampsites}); // no err then render campsites
        }
    });
   
});

//NEW ROUTE - Display form to make new campsite
app.get('/campsites/new', function(req, res){
    res.render('new');
});

//CREATE ROUTE- Add a new campsite to the DB
app.post('/campsites', function(req, res){
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

//SHOW ROUTE - adding a new route to show the info of specific campsite
//order of the route is imp so this has to be after the RESTFUL routes
app.get('/campsites/:id', function(req, res){
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

app.listen(process.env.PORT, process.env.ID, function(){
    console.log('camping_app started!');
});