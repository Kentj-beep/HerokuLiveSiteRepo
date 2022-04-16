import express, {Request, Response, NextFunction} from 'express';

import passport from 'passport';

import User from '../Models/user';
import { GenerateToken, UserDisplayName } from '../Util/index';

// Display Functions
export function DisplayLoginPage(req: Request, res: Response, next: NextFunction): void
{
    if(!req.user)
    {
      return res.render('index', { title: 'Login', page: 'login', messages: req.flash('loginMessage'), displayName: UserDisplayName(req) });
    }
    return res.redirect('/contact-list');
}

export function DisplayRegisterPage(req: Request, res: Response, next: NextFunction): void
{
    if(!req.user)
  {
  res.render('index', { title: 'Register', page: 'register', messages: req.flash('registerMessage'), displayName: UserDisplayName(req) });
  }
  return res.redirect('/contact-list');
}

// Process Functions
export function ProcessLoginPage(req: Request, res: Response, next: NextFunction): void
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

    const authToken = GenerateToken(user);
    console.log(authToken);

    return res.redirect('/contact-list');

  })(req, res, next);
}

export function ProcessRegisterPage(req: Request, res: Response, next: NextFunction): void
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
}

export function ProcessLogoutPage(req: Request, res: Response, next: NextFunction): void
{
    req.logOut();
    res.redirect('/login');
}