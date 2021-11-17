const express = require('express')
const app = express()
const mongoose = require('mongoose')
const blogRoutes = require('./routes/blogRoutes')
const userRoutes = require('./routes/users')
require('dotenv').config()
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

//Passport config
require('./config/passport')(passport)

// Connect to MongoDB and creating the server until .then runs
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology:true })
    .then((res) => app.listen(process.env.PORT || 8080))
    .catch((err) => console.log(err))

// Register view engine
app.set('view engine', 'ejs')

// Static files and middleware
app.use(express.static('./public'))
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// Routes 
app.get('/', (req, res) => {
    res.redirect('/blogs')
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'})
})

// Blog routes
app.use('/users', userRoutes)
app.use('/blogs', blogRoutes)

// 404
app.use((req, res) => {
    res.status(404).render('404', { title: '404'})
})

