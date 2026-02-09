const Post = require('../../models/post');
const User = require('../../models/user');

async function handleCreatePost(req, res) {
    try {
        const { content, photos, isPublic } = req.body;
        const author = req.user.id;

        if (!content || content.length > 200) {
            return res.status(400).json({
                message: "Content is required and must be under 200 characters"
            });
        }

        let post = await Post.create({
            content,
            photos: photos || [],
            isPublic,
            author
        });

        post = await post.populate("author", "username name avatar");

        return res.status(201).json({
            message: 'Post created successfully',
            post
        });

    } catch (error) {
        console.log("Create Post Error:", error.message);
        console.log("Full Error:", error);

        return res.status(500).json({
            message: 'Internal server error',
            error: error.message  // temporarily showing error for debugging
        });
    }
}

async function handleGetAllPosts(req, res) {
    try {
        const posts = await Post.find().populate("author", "username name avatar");
        return res.status(200).json({
            message: 'Posts fetched successfully',
            posts
        });
    } catch (error) {
        console.log("Get All Posts Error:", error.message);
        console.log("Full Error:", error);

        return res.status(500).json({
            message: 'Internal server error',
            error: error.message  // temporarily showing error for debugging
        });
    }
}

module.exports = { handleCreatePost, handleGetAllPosts };
