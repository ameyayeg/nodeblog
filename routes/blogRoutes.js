const express = require('express')
const Blog = require('../models/blogs')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

router.get('/', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err)
        })
})

router.post('/', (req, res) => {
    const blog = new Blog(req.body)

    blog.save()
        .then((result) => {
            res.redirect('/blogs')
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('create', {
         title: 'Create a new blog',
         name: req.user.name
        })
})

router.get('/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id
    Blog.findById(id)
        .then((result) => {
            res.render('details', { 
                blog: result, 
                title: 'A blog',
                name: req.user.name
             })
        })
        .catch((err) => {
            res.status(404).render('404', { title: `Blog not found` })
        })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id 
    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/blogs' })
        })
        .catch((err) => {
            console.log(err)
        })
})

module.exports = router