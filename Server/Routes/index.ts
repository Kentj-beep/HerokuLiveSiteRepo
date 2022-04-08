import express from 'express';
import passport from 'passport';
const router = express.Router();

import Contact from '../Models/contact';
import User from '../Models/user';
import { AuthGuard, UserDisplayName } from '../Util/index';

/******************************************************* TOP-LEVEL ROUTES  ********************************************************/

/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.render('index', { title: 'Home', page: 'home', displayName: UserDisplayName(req) });
});

/* GET home page. */
router.get('/home', function(req, res, next) 
{
  res.render('index', { title: 'Home', page: 'home', displayName: UserDisplayName(req) });
});

/* GET about page. */
router.get('/about', function(req, res, next) 
{
  res.render('index', { title: 'About Us', page: 'about', displayName: UserDisplayName(req) });
});

/* GET projects page. */
router.get('/projects', function(req, res, next) 
{
  res.render('index', { title: 'Our Projects', page: 'projects', displayName: UserDisplayName(req) });
});

/* GET services page. */
router.get('/services', function(req, res, next) 
{
  res.render('index', { title: 'Our Services', page: 'services', displayName: UserDisplayName(req) });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) 
{
  res.render('index', { title: 'Contact Us', page: 'contact', displayName: UserDisplayName(req) });
});

/******************************************************* AUTHENTICATION ROUTES  ********************************************************/

/* GET display login page. */
router.get('/login', function(req, res, next) 
{
  if(!req.user)
  {
    return res.render('index', { title: 'Login', page: 'login', messages: req.flash('loginMessage'), displayName: UserDisplayName(req) });
  }
  return res.redirect('/contact-list');
});

/* POST process login request. */
router.post('/login', function(req, res, next) 
{
  passport.authenticate('local', function(err, user, info)
  {
    // Are there server errors?
    if(err)
    {
      console.error(err);
      res.end(err);
    }

    // Are there login errors?
    if(!user)
    {
      req.flash('loginMessage', 'Authentication Error');
      return res.redirect('/login');
    }

    req.logIn(user, function(err)
    {
        // Are there database errors?
      if(err)
      {
        console.error(err);
        res.end(err);
      }
    });

    return res.redirect('/contact-list');

  })(req, res, next);
});

/* GET display register page. */
router.get('/register', function(req, res, next) 
{
  if(!req.user)
  {
  res.render('index', { title: 'Register', page: 'register', messages: req.flash('registerMessage'), displayName: UserDisplayName(req) });
  }
  return res.redirect('/contact-list');
});

/* POST process register request. */
router.post('/register', function(req, res, next) 
{
  // Instantiate a new user object
  let newUser = new User
  ({
    username: req.body.username,
    EmailAddress: req.body.emailAddress,
    DisplayName: req.body.firstName + " " + req.body.lastName
  });

  User.register(newUser, req.body.password, function(err)
  {
    if(err)
    {
      if(err.name == "UserExistsError")
      {
        console.error('ERROR: User Already Exists!');
        req.flash('registerMessage', 'Registration Error');
      }
      console.error(err.name); // Other error
      req.flash('registerMessage', 'Server Error');
      return res.redirect('/register');
    }

    // Automatically login the user
    return passport.authenticate('local')(req, res, function()
    {
      return res.redirect('/contact-list');
    });

  });
});

/* Process logout request. */
router.get('/logout', function(req, res, next) 
{
  req.logOut();
  res.redirect('/login');
});

/******************************************************* CONTACT-LIST ROUTES  ********************************************************/

/* Temporary Routes - Contact-List Related */
/* GET contact-list page. */
router.get('/contact-list', AuthGuard, function(req, res, next) 
{
  Contact.find(function(err, contactsCollection)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }
    res.render('index', { title: 'Contact List', page: 'contact-list', contacts: contactsCollection, displayName: UserDisplayName(req) });
  });
});

/* Display the Add Page. */
router.get('/add', AuthGuard, function(req, res, next) 
{
  res.render('index', { title: 'Add', page: 'edit', contact: '', displayName: UserDisplayName(req) });
});

/* Process the Add Request. */
router.post('/add', AuthGuard, function(req, res, next) 
{
  // Create a new contact to add
  let newContact = new Contact({
    "FullName": req.body.fullName,
    "ContactNumber": req.body.contactNumber,
    "EmailAddress": req.body.emailAddress
  });

  // Insert the contact to the DB
  Contact.create(newContact, function(err)
  {
    if (err)
    {
      console.error(err);
      res.end(err);
    }

    // newContact has been added to the DB -> goto contact-list
    res.redirect('/contact-list');
  })
});

/* Display the Edit Page with Data injected from the DB. */
router.get('/edit/:id', AuthGuard, function(req, res, next) 
{
  let id = req.params.id;

  // Pass the ID to the DB and read the contact in
  Contact.findById(id, {}, {}, function(err, contactToEdit)
  {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    // Show the edit view with the data
    res.render('index', { title: 'Edit', page: 'edit', contact: contactToEdit, displayName: UserDisplayName(req) });
  });
});

/* Process the Edit request */
router.post('/edit/:id', AuthGuard, function(req, res, next) 
{
  let id = req.params.id;

  // Create a new contact to edit
  let updatedContact = new Contact({
    "_id": id,
    "FullName": req.body.fullName,
    "ContactNumber": req.body.contactNumber,
    "EmailAddress": req.body.emailAddress
  });

  // db.contacts.update
  Contact.updateOne({_id: id}, updatedContact, function(err: ErrorCallback)
  {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    // The edit worked 
    res.redirect('/contact-list');
  });
});

/* Process the Delete requese */
router.get('/delete/:id', AuthGuard, function(req, res, next) 
{
  let id = req.params.id;

  // Pass the ID to the DB and delete the contact
  Contact.remove({_id: id}, function(err)
  {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    // The delete worked
    res.redirect('/contact-list');
  });
});

export default router;
