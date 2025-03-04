import fs from "fs";
import path from "path";
import Post from "../models/Post.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
    try {
        const { title, content, user, image } = req.body;

        if (!user) {
            return res.status(400).json({ message: "Username is required" });
        }

        const foundUser = await User.findOne({ username: user });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }


        const newPost = new Post({
            user: foundUser._id,
            username: foundUser.username,
            title,
            content,
            image: image,
        });

        await newPost.save();

        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
    }
};

export const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Delete image file if it exists
        if (post.image) {
            const imagePath = path.join("uploads", path.basename(post.image));
            fs.access(imagePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(imagePath, (err) => {
                        if (err) console.error("Error deleting image:", err);
                    });
                }
            });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error });
    }
};

export const fetchPosts = async (req, res) => {
    try {
        const posts = await Post.find() // Populate user info
        res.json(posts.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error });
    }
};

export const editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;


        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Ensure only the owner can update
        if (post.user.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized: You can only edit your own posts" });
        }

        // Update post fields
        const updatedData = { ...req.body };

        // If a new image is uploaded, update the image field
        if (req.file) {
            updatedData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        // Update post
        const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, { new: true });

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const likeAndUnlike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id; // Ensure user is authenticated

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if user already liked the post
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            // If already liked, remove like
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            // Otherwise, add like
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json({ likesCount: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const fetchUserpost = async (req, res) => {
    try {
        let userId = req.user.id;

        // Ensure userId is an ObjectId (only convert if needed)
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const userPosts = await Post.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json(userPosts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user posts" });
    }
}

export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // ✅ Create new comment object with createdAt
        const newComment = {
            user: req.user.id,
            text,
            createdAt: new Date() // Ensure createdAt exists
        };
        post.comments.push(newComment);

        await post.save();

        // ✅ Fetch the newly added comment with user details
        const populatedPost = await Post.findById(req.params.id)
            .populate("comments.user", "username _id"); // Ensure user details are included

        const latestComment = populatedPost.comments[populatedPost.comments.length - 1]; // ✅ Now correctly populated

        res.status(201).json({
            message: "Comment added",
            comment: {
                _id: latestComment._id,
                user: {
                    _id: latestComment.user._id,
                    username: latestComment.user.username || "Unknown User" // ✅ Prevent errors if username is missing
                },
                text: latestComment.text,
                createdAt: latestComment.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = post.comments.find((c) => c._id.toString() === commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // ✅ Ensure correct user authentication
        if (comment.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // ✅ Use `pull` instead of `remove()`
        post.comments.pull({ _id: commentId });
        await post.save();

        res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const fetchComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("comments.user", "username");

        if (!post) return res.status(404).json({ message: "Post not found" });

        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const fetchSinglePost = async (req, res) => {
    try {
        const { username, password } = req.query; 

    if (password !== "123456") {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    const posts = await Post.find({ username }).populate("user", "username email");

    if (!posts.length) return res.status(404).json({ message: "No posts found for this username" });

    res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
