const express = require('express')
const app = express()
const mongoose = require('mongoose')
const blogRoutes = require('./routes/blogRoutes')
require('dotenv').config()

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


// Routes 
app.get('/', (req, res) => {
    res.redirect('/blogs')
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'})
})

// Blog routes

app.use('/blogs', blogRoutes)

// 404
app.use((req, res) => {
    res.status(404).render('404', { title: '404'})
})

