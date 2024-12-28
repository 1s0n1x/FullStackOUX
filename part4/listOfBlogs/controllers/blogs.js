const blogsRouter = require(`express`).Router();

const Blog = require(`../models/blogs`);
const User = require(`../models/users`);
const { userExtractor } = require(`../utils/middleware`);


blogsRouter.get(`/`, async (req, res) => {
    let blogResult = await Blog.find({}).populate({
        path: 'user',
        select: 'id username name'
    });
    res.json(blogResult)                                                                                                                                                                                                                     ;
})
blogsRouter.post(`/`, userExtractor, async (req, res) => {
    const blogOwner = await User.findById(req.user);
    const blogReg = new Blog({ ...req.body, user: blogOwner._id });
    const blogResult = await blogReg.save();

    blogOwner.blogs = blogOwner.blogs.concat(blogResult._id);
    await blogOwner.save();
    res.status(201).json(blogResult);
})
blogsRouter.delete(`/:id`, userExtractor, async (req, res) => {
    const userReq = await User.findById(req.user);
    const blogSel = await Blog.findById(req.params.id);

    if (blogSel.user.toString() === decodedToken.id) {
        await Blog.findByIdAndRemove(req.params.id);
        userReq.blogs = userReq.blogs.filter(bID => bID.toString() !== req.params.id);

        await userReq.save();
        res.status(204).end();
    } else {
        res.status(401).json({ error: 'unauthorized' });
    }
});
blogsRouter.put(`/:id`, userExtractor, async (req, res) => {
    const blogSel = await Blog.findById(req.user);
    if (blogSel.user.toString() === decodedToken.id) {
        let blogUpdated = await Blog.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
        res.status(200).json(blogUpdated);
    } else {
        res.status(401).json({ error: 'unauthorized' });
    }
});

module.exports = blogsRouter;