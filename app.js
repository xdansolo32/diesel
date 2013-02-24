var express = require ('express'),
	async   = require('async');;
	
var app = express();
	app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	
    // set this to a secret value to encrypt session cookies
    express.session({ secret: process.env.SESSION_SECRET || 'secret123' }),
    require('faceplate').middleware({
      app_id: process.env.FACEBOOK_APP_ID,
      secret: process.env.FACEBOOK_SECRET,
      scope:  'user_likes,user_photos,user_photo_video_tags'
    })
});	

// Routes

app.get('/', function (req, res) {
   res.redirect('/index.html');
});

//DB STOOFS
var mongoose = require('mongoose');
var MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test';
mongoose.connect(MONGO_DB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'FUCKING connection error:'));
db.once('open', function callback () {
  console.log('FUCK YEAH!!! DA DEEBEE IS OPEN!!');
});

var userSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	age: Number,
	birthday: Date,
	likesGirls: Boolean
});

var transactionSchema = mongoose.Schema({
	transactionId: String,
	//hostHash
	//arrayOfLenders
	maturityDate: Date
})

userSchema.methods.displayStats = function() {
	var fn = this.firstName,
	ln = this.lastName,
	email = this.email,
	age = this.age,
	birthday = this.birthday,
	likesGirls = this.likesGirls;
	console.log("THIS ARE AM THE MONGOOZ DATABASE YOOZIR SKEEMA TESTING AREA!!!! \n")
	console.log("HI, MY NAME IS " + fn + " " + ln);
	console.log("I am " + age + ", and my birthday is " + birthday);
	console.log("If you are wondering and are a girl, my interest in you is: " + likesGirls);
}

var User = mongoose.model('User', userSchema),
	Transaction = mongoose.model('Transaction', transactionSchema);
var daniel = new User({firstName: 'daniel', lastName: 'sun', email:'daniel@sun.com',
	age: 28, birthday: new Date(2013, 02, 20, 1, 1, 1, 1), likesGirls: true});
	
daniel.displayStats();

// REST stuff
app.get('/users', function (req, res) {
    User.find({}, function (err, markers) {
        res.contentType('json');
        res.json({
            success: true,
          data: markers
        });
    });
});

app.get('/transactions/:transactionId', function (req, res) {
    Transation.find({transactionId: +req.params.transactionId}, function (err, markers) {
        res.contentType('json');
        res.json({
            success: true,
          data: markers
        });
    });
});

/*
// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
*/

app.listen(3000);
console.log("Listening on port 3000.");

//FB Crap
function render_page(req, res) {
  req.facebook.app(function(app) {
    req.facebook.me(function(user) {
      res.render('index.ejs', {
        layout:    false,
        req:       req,
        app:       app,
        user:      user
      });
    });
  });
}

function handle_facebook_request(req, res) {

  // if the user is logged in
  if (req.facebook.token) {
	  /*  // WE should do the below to clean up our JS and make debugging easier
	  async.parallel({
		  getMahFriends: function(cb) {
		  	
		  }
	  })
	  */
    async.parallel([
      function(cb) {
        // query 4 friends and send them to the socket for this socket id
        req.facebook.get('/me/friends', { limit: 4 }, function(friends) {
          req.friends = friends;
          cb();
        });
      },
      function(cb) {
        // query 16 photos and send them to the socket for this socket id
        req.facebook.get('/me/photos', { limit: 16 }, function(photos) {
          req.photos = photos;
          cb();
        });
      },
      function(cb) {
        // query 4 likes and send them to the socket for this socket id
        req.facebook.get('/me/likes', { limit: 4 }, function(likes) {
          req.likes = likes;
          cb();
        });
      },
      function(cb) {
        // use fql to get a list of my friends that are using this app
        req.facebook.fql('SELECT uid, name, is_app_user, pic_square FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1', function(result) {
          req.friends_using_app = result;
          cb();
        });
      }
    ], function() {
      render_page(req, res);
    });

  } else {
    render_page(req, res);
  }
}

app.get('/', handle_facebook_request);
app.post('/', handle_facebook_request);
