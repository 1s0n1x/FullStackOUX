const blogsRouter = require(`express`).Router();
const Blog = require(`../models/blogs`);

blogsRouter.get(`/`, (req, res) => {
    Blog.find({})
        .then((data) => {
            res.json(data);
        })
})
blogsRouter.post(`/`, (req, res, next) => {
    const blogReg = new Blog(req.body);

    blogReg
        .save()
        .then((data) => {
            res.status(201).json(data)
        })
        .catch((err) => next(err))
})

module.exports = blogsRouter;