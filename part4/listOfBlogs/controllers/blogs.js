const blogsRouter = require(`express`).Router();
const Blog = require(`../models/blogs`);

blogsRouter.get(`/`, async (req, res) => {
    let blogResult = await Blog.find({});
    res.json(blogResult)                                                                                                                                                                                                                     ;
})
blogsRouter.post(`/`, async (req, res, next) => {
    const blogReg = new Blog(req.body);
    const blogResult = await blogReg.save();

    res.status(201).json(blogResult);
})

module.exports = blogsRouter;