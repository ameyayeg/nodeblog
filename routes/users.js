const express = require('express')
const router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const passport = require('passport')

//Login page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login'})
})

//Register page
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register'})
})

//Register handle

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []

    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all fields'})
    } 
    // Check passwords match
    if(password !== password2) {
        errors.push({msg: 'Passwords do not match'})
    }
    // Check password length 
    if(password.length < 6) {
        errors.push({msg: 'Password should be at least six characters'})
    }

    if(errors.length > 0) {
        res.render('register', {
            title: 'Register',
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation pass
        User.findOne({email: email})
            .then(user => {
                if(user) {
                    errors.push({ msg: 'Email already exists' })
                    res.render('register', {
                        title: 'Register',
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err

                        //Set password to hashed
                        newUser.password = hash
                        // Save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in')
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err))
                    }))

                }
            })
    }
})

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/blogs',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

module.exports = router