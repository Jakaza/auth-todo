require('dotenv').config();
const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oidc');
const crypto = require('crypto')
const db = require('../db')
const router = express.Router()

passport.use(new LocalStrategy(function verify(username, password, cb){
    db.get('SELECT * FROM users WHERE username = ?', [username], function(err, row){
        if(err) return cb(err)
        if(!row) return cb(null, false, {message: 'Incorrect username or password'})
        crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword){
            if(err) return cb(err)
            if(!crypto.timingSafeEqual(row.hashed_password, hashedPassword)){
                return cb(null, false, {message: 'Incorrect username or password'})
            }
            return cb(null, row)
        })
    })
}))

passport.use(new GoogleStrategy({ 
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/oauth2/redirect/google',
    scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {

    console.log('Profile : ', profile)
    console.log('Issuer : ', issuer)

    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
      issuer,
      profile.id
    ], function(err, row) {
      if (err) { return cb(err); }
      if (!row) {
        db.run('INSERT INTO users (username) VALUES (?)', [
          profile.displayName
        ], function(err) {
          if (err) { return cb(err); }
  
          var id = this.lastID;
          db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
            id,
            issuer,
            profile.id
          ], function(err) {
            if (err) { return cb(err); }
            var user = {
              id: id,
              name: profile.displayName
            };
            return cb(null, user);
          });
        });
      } else {
        db.get('SELECT * FROM users WHERE id = ?', [ row.user_id ], function(err, row) {
          if (err) { return cb(err); }
          if (!row) { return cb(null, false); }
          console.log(row);
          return cb(null, row);
        });
      }
    });
  }));

passport.serializeUser(function(user, cb){
    process.nextTick(function(){
        cb(null, {id: user.id, username: user.username})
    })
})
passport.deserializeUser(function(user, cb){
    process.nextTick(function(){
        return cb(null, user)
    })
})

router.get('/login/federated/google', passport.authenticate('google'))

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

router.get('/login', (req , res, next )=>{
    res.render('login')
})
router.get('/signup', (req , res, next )=>{
    res.render('signup')
})

router.post('/signup', (req , res, next )=>{
    const salt = crypto.randomBytes(16)

    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword){
        if(err) return next(err)

        db.run('INSERT INTO users (username, hashed_password, salt) VALUES(?, ?, ?)', 
        [
            req.body.username,
            hashedPassword,
            salt
        ], function(err){
            if(err) return next(err)

            const user = {
                id: this.lastID, 
                username: req.body.username
            }

            req.logIn(user, function(){
                if(err) return next(err)

                res.redirect('/')
            })
        })
    })
})
router.post('/logout', (req , res, next )=>{
    req.logOut(function(err){
        if(err) return next(err)

        res.redirect('/')
    })
})

module.exports = router