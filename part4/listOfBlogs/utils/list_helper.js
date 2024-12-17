const dummy = (blogs) => {
    if(Array.isArray(blogs)){
        return 1;
    } else {
        return 0;
    }
};

const totalLikes = (blogs) => {
    if(Array.isArray(blogs)){
        let likes = 0;
        blogs.forEach((data) => {
            likes += data.likes;
        })
        return likes;
    } else {
        return 0;
    }
};
const favoriteBlog = (blogs) => {
    if(Array.isArray(blogs)){
        let mostFav = blogs.reduce(
            (max, obj) => (obj.likes > max.likes ? obj : max), blogs[0]
        );
        return {
            title: mostFav.title,
            author: mostFav.author,
            likes: mostFav.likes
        }
    } else {
        return 0;
    }
};
const mostBlogs = (blogs) => {
    let bloggers = {};
    let result = {
        author: "",
        blogs: 0
    };

    if(Array.isArray(blogs)){
        blogs.forEach((data) => {
            Object.hasOwn(bloggers, data.author)
                ? ++bloggers[data.author]
                : bloggers[data.author] = 1;
        })

        Object.keys(bloggers).forEach((bName) => {
            bloggers[bName] > result.blogs 
                ? (() => {
                    result.blogs = bloggers[bName];
                    result.author = bName;
                })()
                : undefined;
        })

        return result;
    } else {
        return 0;
    }
};
const mostLikes = (blogs) => {
    let bloggers = {};
    let result = {
        author: "",
        likes: 0
    };

    if(Array.isArray(blogs)){
        blogs.forEach((data) => {
            Object.hasOwn(bloggers, data.author)
                ? bloggers[data.author] += data.likes
                : bloggers[data.author] = data.likes
        })

        Object.keys(bloggers).forEach((bName) => {
            bloggers[bName] > result.likes
                ? (() => {
                    result.likes = bloggers[bName];
                    result.author = bName;
                })()
                : undefined;
        })

        return result;
    } else {
        return 0;
    }
};


module.exports = {
    dummy,

    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}