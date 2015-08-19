var User = require('../models/user.js');
// Simple index controller defined
var indexController = {

  // Handle incoming requests for the '/' route
  index: function(req, res){

    // Since this route requires authentication,
    // called out in app.js, we have access to the
    // logged-in user's document from the database
    // via the injected "req.user" variable
    res.render('index', {
      user: req.user
    });
  },
  templates: function(req, res){
    res.render('templates/' + req.params.templateName, {
    user: req.user  
    } )
    // res.send(req.user)
  },
  updateList: function(req, res){
    console.log('req body:', req.body);
    User.findOne({_id: req.body._id}, function(err, document){
      if (err){
        console.log(err);
      }
      document.lists = req.body.lists;
      document.markModified('lists');
      document.save(function(err, savedDoc){
        console.log('err', err);
        res.send(savedDoc)
      });
      console.log('docs', document); 
    });
  },
  allUsers: function(req, res){
    User.find({}, function(err, users){
      res.send(users)
    })
  }
};

// Export our index control
module.exports = indexController;